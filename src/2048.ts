import {GameManager} from "./Game";

(function () {
    const ele: Element | null = document.getElementById('game_2048')
    let manager: GameManager
    if (ele == null)
        return
    manager = new GameManager(ele)
    manager.matrix.setMatrix([[2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0]])
    manager.clean()
    manager.render();
    const res_btn = document.getElementById("restart")
    if (res_btn === null) {
        return
    }
    res_btn.addEventListener("click", function () {
        manager.restart()
        manager.clean()
        manager.render()
    })
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 38) {
            manager.action('u')
        } else if (event.keyCode === 40) {
            manager.action('d')
        } else if (event.keyCode === 37) {
            manager.action('l')
        } else if (event.keyCode === 39) {
            manager.action('r')
        }
    })
})()