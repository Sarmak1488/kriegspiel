import { Injectable } from '@angular/core';
// BehaviorSubject - это особая штука из библиотеки RxJS.
// Представьте её как "волшебную доску", на которой всегда написано ТЕКУЩЕЕ состояние игры.
// Как только мы на ней что-то стираем и пишем новое, все, кто на неё смотрит,
// мгновенно видят это изменение.
import { BehaviorSubject } from 'rxjs';

// Это просто название для возможных состояний, чтобы не ошибиться в тексте.
export type GameState = 'EDIT_MODE' | 'ORDER_PHASE_SIDE_1' | 'ORDER_PHASE_SIDE_2' | 'ACTION_PHASE';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  // Создаем нашу "волшебную доску". Она приватная (_gameState),
  // то есть писать на ней может только сам сервис.
  // Начальное значение - 'EDIT_MODE'.
  private readonly _gameState = new BehaviorSubject<GameState>('EDIT_MODE');

  // А это "публичная" версия доски (gameState$), на которую все могут только СМОТРЕТЬ.
  // Знак '$' в конце - это просто договоренность называть так "наблюдаемые" вещи.
  readonly gameState$ = this._gameState.asObservable();

  constructor() { }

  // Это метод, с помощью которого мы будем менять состояние на "волшебной доске".
  setGameState(newState: GameState) {
    // .next() - это команда "написать новое значение на доске".
    this._gameState.next(newState);
    console.log(`Новое состояние игры: ${newState}`); // Выведем в консоль для отладки
  }
}