import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class Engine3D {
    constructor(game) {
        this.game = game;
        this.app = game.app;

        // Scene basic setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e1a);
        this.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.002);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Container
        this.container = null;

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0x4a9eff, 1.5);
        mainLight.position.set(100, 200, 100);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        // Grid / Floor (Neon style)
        const gridHelper = new THREE.GridHelper(2000, 100, 0x4a9eff, 0x1a2236);
        this.scene.add(gridHelper);

        // Controls
        this.controls = new PointerLockControls(this.camera, document.body);

        // Weapon
        this.weapon = this.createWeapon();
        this.camera.add(this.weapon);
        this.scene.add(this.camera); // Need to add camera to scene to see attached children

        // Players/Entities mapping
        this.meshMap = new Map(); // gameEntity -> ThreeMesh

        // Point Light to follow player
        this.playerLight = new THREE.PointLight(0x4a9eff, 1, 300);
        this.scene.add(this.playerLight);

        // Setup crosshair
        this.setupCursor();

        // Bind internal loop
        this.animate = this.animate.bind(this);
    }

    init(container) {
        this.container = container;
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1';
        container.appendChild(this.renderer.domElement);

        // Click to Lock
        container.addEventListener('click', (e) => {
            if (!this.game.paused && !this.game.gameOver && this.game.running) {
                this.controls.lock();
                e.stopPropagation();
            }
        });

        this.controls.addEventListener('lock', () => {
            console.log('🔒 Mouse Locked');
        });

        this.controls.addEventListener('unlock', () => {
            console.log('🔓 Mouse Unlocked');
            if (!this.game.gameOver && !this.game.paused && this.game.running) {
                this.game.togglePause();
            }
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupCursor() {
        // Hud is handled by GameEngine's 2D canvas overlay
    }

    createWeapon() {
        const group = new THREE.Group();

        // Cannon
        const geom = new THREE.BoxGeometry(2, 2, 10);
        const mat = new THREE.MeshPhongMaterial({ color: 0x333333, emissive: 0x4a9eff, emissiveIntensity: 0.1 });
        const cannon = new THREE.Mesh(geom, mat);
        cannon.position.set(4, -4, -10);
        group.add(cannon);

        // Body
        const bodyGeom = new THREE.BoxGeometry(3, 4, 6);
        const body = new THREE.Mesh(bodyGeom, mat);
        body.position.set(4, -5, -6);
        group.add(body);

        return group;
    }

    // Sync 2D entities to 3D meshes
    updateEntities(entities, player) {
        const time = Date.now() / 1000;

        // Player sync
        if (player) {
            // Camera follow (FPS)
            this.camera.position.set(player.x, 20, player.y); // Slightly higher eye level
            this.playerLight.position.set(player.x, 30, player.y);

            // Weapon bobbing - Use distance moved to detect movement
            const movedDist = Math.hypot(player.x - (this.lastPx || player.x), player.y - (this.lastPy || player.y));
            this.lastPx = player.x;
            this.lastPy = player.y;

            if (movedDist > 0.01) {
                this.weapon.position.y = -4 + Math.sin(time * 12) * 0.2;
                this.weapon.position.x = 4 + Math.cos(time * 6) * 0.1;
                this.weapon.rotation.z = Math.sin(time * 6) * 0.05;
            } else {
                this.weapon.position.y = THREE.MathUtils.lerp(this.weapon.position.y, -4, 0.1);
                this.weapon.position.x = THREE.MathUtils.lerp(this.weapon.position.x, 4, 0.1);
                this.weapon.rotation.z = THREE.MathUtils.lerp(this.weapon.rotation.z, 0, 0.1);
            }

            // Sync direction for shooting
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            player.viewDirection = direction;
        }

        // Entities syncing
        for (const entity of entities) {
            let mesh = this.meshMap.get(entity);
            if (!mesh) {
                mesh = this.createMeshForEntity(entity);
                this.meshMap.set(entity, mesh);
                this.scene.add(mesh);
            }

            // Sync positions (2D X/Y -> 3D X/Z)
            mesh.position.set(entity.x, (entity.type === 'projectile' ? (entity.z || 10) : 10), entity.y);

            // Rotate enemies towards player
            if (entity.type === 'enemy' && player) {
                mesh.lookAt(player.x, 10, player.y);
            }

            // Alive status
            if (!entity.alive) {
                this.scene.remove(mesh);
                this.meshMap.delete(entity);
            }
        }

        // Sync Walls
        if (this.game.walls) {
            this.syncWalls(this.game.walls);
        }
    }

    createMeshForEntity(entity) {
        let geometry, material;
        const color = entity.color || 0x4a9eff;
        const size = entity.width || 20;

        if (entity.type === 'enemy' || entity.type === 'boss') {
            geometry = new THREE.BoxGeometry(size, size, size);
            material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.3,
                shininess: 100
            });
        } else if (entity.type === 'projectile') {
            geometry = new THREE.SphereGeometry(size / 2 || 3, 8, 8);
            material = new THREE.MeshBasicMaterial({ color: color });
        } else if (entity.type === 'bot') {
            geometry = new THREE.CylinderGeometry(size / 2, size / 2, size, 8);
            material = new THREE.MeshPhongMaterial({ color: color });
        } else {
            geometry = new THREE.BoxGeometry(size, size, size);
            material = new THREE.MeshStandardMaterial({ color: 0x8b95a8 });
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    syncWalls(walls) {
        for (const wall of walls) {
            if (!this.meshMap.has(wall)) {
                const geom = new THREE.BoxGeometry(wall.w, 40, wall.h);
                const mat = new THREE.MeshPhongMaterial({
                    color: 0x4a9eff,
                    transparent: true,
                    opacity: 0.3,
                    emissive: 0x4a9eff,
                    emissiveIntensity: 0.5
                });
                const mesh = new THREE.Mesh(geom, mat);
                mesh.position.set(wall.x + wall.w / 2, 20, wall.y + wall.h / 2);
                this.scene.add(mesh);
                this.meshMap.set(wall, mesh);
            }
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate(dt) {
        this.render();
    }
}
