import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import ParticleSystem from "../../Wolfie2D/Rendering/Animations/ParticleSystem";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";

 

/**
 * // TODO get the particles to move towards the mouse when the player attacks
 * 
 * The particle system used for the player's attack. Particles in the particle system should
 * be spawned at the player's position and fired in the direction of the mouse's position.
 */
export default class PlayerWeapon extends ParticleSystem {

    public toggle: boolean = true;

    public getPool(): Readonly<Array<Particle>> {
        return this.particlePool;
    }

    /**
     * @returns true if the particle system is running; false otherwise.
     */
    public isSystemRunning(): boolean { 
        if(this.toggle){
            return this.systemRunning;
        }else{
            return true;
        }
    }

    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    public setParticleAnimation(particle: Particle) {
        // Give the particle a random velocity.
        // particle.vel = RandUtils.randVec(100, 200, -32, 32);
        
        let dist = Math.sqrt(Math.pow(Input.getGlobalMousePosition().x - this.sourcePoint.x,2) + Math.pow(Input.getGlobalMousePosition().y - this.sourcePoint.y,2))
        particle.vel = RandUtils.randVec(
            MathUtils.clamp((Input.getGlobalMousePosition().x - RandUtils.randFloat(this.sourcePoint.x-10,this.sourcePoint.x+10)) /dist * 100,-100,100), MathUtils.clamp((Input.getGlobalMousePosition().x - RandUtils.randFloat(this.sourcePoint.x-10,this.sourcePoint.x+10))/dist * 200,-200,200) , MathUtils.clamp((Input.getGlobalMousePosition().y - RandUtils.randFloat(this.sourcePoint.y-10,this.sourcePoint.y+10))/dist * 100,-100,100), MathUtils.clamp((Input.getGlobalMousePosition().y - RandUtils.randFloat(this.sourcePoint.y-10,this.sourcePoint.y+10))/dist * 200,-200,200));
        particle.color = Color.RED;
        // let factor = 1;
        // let rand_start = RandUtils.randVec(this.sourcePoint.x/factor,this.sourcePoint.x*factor,this.sourcePoint.y/factor,this.sourcePoint.y*factor)
        // let rand_end = RandUtils.randVec(Input.getGlobalMousePosition().x/factor,Input.getGlobalMousePosition().x*factor,Input.getGlobalMousePosition().y/factor,Input.getGlobalMousePosition().y*factor)

        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_SINE
                },
                // {
                //     property: "positionX",
                //     start: rand_start.x,
                //     end: RandUtils.randFloat(Input.getGlobalMousePosition().x-20,Input.getGlobalMousePosition().x+20),
                //     ease: EaseFunctionType.IN_OUT_SINE
                // },
                // {
                //     property: "positionY",
                //     start: rand_start.y,
                //     end: RandUtils.randFloat(Input.getGlobalMousePosition().y-20,Input.getGlobalMousePosition().y+20),
                //     ease: EaseFunctionType.IN_OUT_SINE
                // }
            ]
        });
    }

}