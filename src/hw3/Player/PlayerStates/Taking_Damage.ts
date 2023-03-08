import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { HW3Events } from "../../HW3Events";
import { PlayerStates, PlayerAnimations } from "../PlayerController";
import PlayerState from "./PlayerState";

/**
 * The Dead state for the player's FSM AI. 
 */
export default class Taking_Damage extends PlayerState {

    // Trigger the player's death animation when we enter the dead state
    public onEnter(options: Record<string, any>): void{
        this.owner.animation.play(PlayerAnimations.TAKING_DAMAGE,false) 
    }

    public handleInput(event: GameEvent): void { }

    public update(deltaT: number): void {
        if(!this.owner.animation.isPlaying("TAKING_DAMAGE")){
            if(this.parent.health > 0){
                this.finished("IDLE");
            }else{
                this.finished("DYING");
            }
            
        }
    }

    public onExit(): Record<string, any> { 
        this.owner.animation.stop();
		return {};
    }
}