/* ============================
   DROPER — Attack Effects (v1.0.2)
   Visuels détaillés par style d'attaque.
   ============================ */

export class AttackEffects {

    // Dessine le projectile en fonction de son style
    static drawProjectile(ctx, projectile, spriteRenderer) {
        const style = projectile.emitter?.hero?.attackStyle || 'kinetic_bullet';

        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(projectile.angle);

        ctx.fillStyle = projectile.color;
        ctx.strokeStyle = projectile.color;

        switch (style) {
            case 'laser_beam':
                // Trait fin et brillant
                ctx.lineWidth = 3;
                ctx.shadowBlur = 10;
                ctx.shadowColor = projectile.color;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-20, 0);
                ctx.stroke();
                break;

            case 'plasma_cannon':
                // Grosse boule d'énergie pulsante
                ctx.shadowBlur = 15;
                ctx.shadowColor = projectile.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                // Core blanc
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'sniper_tracer':
                // Traçante hyper rapide (très fine et très longue)
                ctx.lineWidth = 1.5;
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.moveTo(5, 0);
                ctx.lineTo(-40, 0);
                ctx.stroke();
                break;

            case 'spirit_blade':
                // Croissant d'énergie magique
                ctx.shadowBlur = 5;
                ctx.shadowColor = projectile.color;
                ctx.beginPath();
                ctx.moveTo(5, 0);
                ctx.quadraticCurveTo(0, -8, -10, -10);
                ctx.quadraticCurveTo(-2, 0, -10, 10);
                ctx.quadraticCurveTo(0, 8, 5, 0);
                ctx.fill();
                break;

            case 'shockwave':
                // Onde de choc sonique / sismique
                ctx.lineWidth = 2;
                ctx.globalAlpha = Math.max(0.1, 1 - (projectile.age / projectile.lifespan)); // Fade out
                ctx.beginPath();
                ctx.arc(0, 0, projectile.age * 200, -Math.PI / 4, Math.PI / 4); // arc progressif
                ctx.stroke();
                break;

            case 'kinetic_bullet':
            default:
                // Balle standard Drop
                ctx.beginPath();
                ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        ctx.restore();
    }
}
