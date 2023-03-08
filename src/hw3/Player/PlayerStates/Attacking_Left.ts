import { PlayerStates, PlayerAnimations } from "../PlayerController";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";
import PlayerState from "./PlayerState";

export default class Attacking_Left extends PlayerState {

	onEnter(options: Record<string, any>): void {
        this.owner.animation.playIfNotAlready(PlayerAnimations.ATTACKING_LEFT);
	}

	update(deltaT: number): void {
        if(!Input.isPressed(HW3Controls.ATTACK)){
            this.finished("IDLE");
        }
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}