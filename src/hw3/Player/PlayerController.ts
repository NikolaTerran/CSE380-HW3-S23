import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import Jump from "./PlayerStates/Jump";
import Walk from "./PlayerStates/Walk";
import Running_Left from "./PlayerStates/Running_Left";
import Running_Right from "./PlayerStates/Running_Right";
import Attacking_Left from "./PlayerStates/Attacking_Left";
import Attacking_Right from "./PlayerStates/Attacking_Right";
import Dying from "./PlayerStates/Dying";

import PlayerWeapon from "./PlayerWeapon";
import Input from "../../Wolfie2D/Input/Input";

import { HW3Controls } from "../HW3Controls";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";
import Dead from "./PlayerStates/Dead";
import Taking_Damage from "./PlayerStates/Taking_Damage";

// TODO play your heros animations

/**
 * Animation keys for the player spritesheet
 */
export const PlayerAnimations = {
    IDLE: "IDLE",
    WALK: "WALK",
    RUNNING_RIGHT: "RUNNING_RIGHT",
    RUNNING_LEFT: "RUNNING_LEFT",
    ATTACKING_LEFT: "ATTACKING_LEFT",
    ATTACKING_RIGHT: "ATTACKING_RIGHT",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    DYING: "DYING",
    DEAD: "DEAD",
    IDLE_LEFT: "IDLE_LEFT"
} as const

/**
 * Tween animations the player can player.
 */
export const PlayerTweens = {
    FLIP: "FLIP",
    DEATH: "DEATH"
} as const

/**
 * Keys for the states the PlayerController can be in.
 */
export const PlayerStates = {
    IDLE: "IDLE",
    JUMP: "JUMP",
    WALK: "WALK",
    RUNNING_LEFT: "RUNNING_LEFT",
    RUNNING_RIGHT: "RUNNING_RIGHT",
    ATTACKING_LEFT: "ATTACKING_LEFT",
    ATTACKING_RIGHT: "ATTACKING_RIGHT",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    DYING: "DYING",
    DEAD: "DEAD",
    FALL: "FALL"
} as const

/**
 * The controller that controls the player.
 */
export default class PlayerController extends StateMachineAI {
    public readonly MAX_SPEED: number = 200;
    public readonly MIN_SPEED: number = 100;

    

    /** Health and max health for the player */
    protected _health: number;
    protected _maxHealth: number;

    /** The players game node */
    protected owner: HW3AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;
    // protected cannon: Sprite;
    protected weapon: PlayerWeapon;
    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.weapon = options.weaponSystem;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = 400;
        this.velocity = Vec2.ZERO;

        this.health = 5
        this.maxHealth = 5;

        // Add the different states the player can be in to the PlayerController 
		this.addState(PlayerStates.IDLE, new Idle(this, this.owner));
		// this.addState(PlayerStates.WALK, new Walk(this, this.owner));
        this.addState(PlayerStates.JUMP, new Jump(this, this.owner));
        this.addState(PlayerStates.FALL, new Fall(this, this.owner));
        this.addState(PlayerStates.DEAD, new Dead(this, this.owner));
        this.addState(PlayerStates.RUNNING_LEFT, new Running_Left(this, this.owner));
        this.addState(PlayerStates.RUNNING_RIGHT, new Running_Right(this, this.owner));
        this.addState(PlayerStates.ATTACKING_LEFT, new Attacking_Left(this, this.owner));
        this.addState(PlayerStates.ATTACKING_RIGHT, new Attacking_Right(this, this.owner));
        this.addState(PlayerStates.DYING, new Dying(this, this.owner));
        this.addState(PlayerStates.TAKING_DAMAGE, new Taking_Damage(this, this.owner));
        
        // Start the player in the Idle state
        this.initialize(PlayerStates.IDLE);
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		direction.x = (Input.isPressed(HW3Controls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(HW3Controls.MOVE_RIGHT) ? 1 : 0);
		direction.y = (Input.isJustPressed(HW3Controls.JUMP) ? -1 : 0);
		return direction;
    }
    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
		super.update(deltaT);
        // // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        if (Input.isPressed(HW3Controls.ATTACK) && !this.weapon.isSystemRunning() && this._health > 0) {
            // Start the particle system at the player's current position
            this.weapon.startSystem(500, 0, this.owner.position);
            // this.changeState(PlayerStates.ATTACKING_LEFT);
        }
	}

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { 
        this._maxHealth = maxHealth; 
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
    }

    public get health(): number { return this._health; }
    public set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
        // If the health hit 0, change the state of the player
        // if (this.health <= 0) { 
        //     this.changeState(PlayerStates.DYING); 
        // }
    }

    
}