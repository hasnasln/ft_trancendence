import { Engine, Scene, Vector3, Mesh } from "@babylonjs/core";
import {startNextSet, updateScoreBoard, updateSetBoard, showEndMessage } from "./ui";
import { GameInfo } from "./network";
import { gameInstance } from "../play";

export function startGameLoop(engine: Engine, scene: Scene, gameInfo: GameInfo, predictedBall: Mesh ): void
{
    engine.runRenderLoop(() =>
      {
        if (gameInfo.state?.matchOver)
          {
            updateScoreBoard(gameInfo);
            updateSetBoard(gameInfo);
            showEndMessage(gameInfo);
            engine.stopRenderLoop();
            return;
          }
        if (gameInfo.state?.setOver)
          {
            if (!gameInfo.nextSetStartedFlag)
            {
              updateScoreBoard(gameInfo);
              startNextSet(gameInfo);
              gameInfo.nextSetStartedFlag = true;
            }
            return;
          }
        if (gameInfo.state?.isPaused) return;
     
        // Topu hareket ettir
        gameInstance.ball!.ball.position = new Vector3(gameInfo.ballState?.bp!.x, gameInfo.ballState?.bp!.y, 0);
        gameInstance.ball!.velocity = new Vector3(gameInfo.ballState?.bv.x, gameInfo.ballState?.bv.y, 0);
        gameInstance.ball!.ball.position.addInPlace(gameInstance.ball!.velocity);
        // pedalları hareket ettir
        gameInstance.paddle1!.position.y = gameInfo.paddle?.p1y!;
        gameInstance.paddle2!.position.y = gameInfo.paddle?.p2y!;


        predictedBall.position.y = gameInfo.ballState?.py!;

        //skor ve set güncellemesi
        updateScoreBoard(gameInfo);
        updateSetBoard(gameInfo);

   
        scene.render();
      });
}
  

