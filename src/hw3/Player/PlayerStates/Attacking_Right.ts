import { PlayerStates, PlayerAnimations } from "../PlayerController";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";
import PlayerState from "./PlayerState";

export default class Attacking_Right extends PlayerState {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play(PlayerAnimations.ATTACKING_RIGHT,false);
	}

	update(deltaT: number): void {
		if(!this.owner.animation.isPlaying(PlayerAnimations.ATTACKING_RIGHT)){
			if(!Input.isPressed(HW3Controls.ATTACK)){
				this.finished("IDLE");
			}else if(!this.owner.onGround){
				this.finished("FALL")
			}
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}