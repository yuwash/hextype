<script>
  import { writeOverText } from './hextype'
  import { onMount } from 'svelte'
	export let text
  let windowHeight
  let pressedKeyL = null
  let pressedKeyR = null
  let lastKeyL = null
  let lastKeyR = null
  let characterSet = null  // Can be null, 0xe or 0xf.
  const keyboardEventCodesL = {KeyF: 0, KeyD: 1, KeyS: 2}
  const keyboardEventCodesR = {KeyJ: 0, KeyK: 1, KeyL: 2}

  const getKeyState = pressedKey => [0, 1, 2].map(key => pressedKey === key)

  const onKeydownL = key => {
    pressedKeyL = key
  }

  const onKeydownR = key => {
    pressedKeyR = key
  }

  const onKeydown = event => {
    if(event.code in keyboardEventCodesL) {
      onKeydownL(keyboardEventCodesL[event.code])
    } else if(event.code in keyboardEventCodesR) {
      onKeydownR(keyboardEventCodesR[event.code])
    }
  }

  const registerLastCharacter = () => {
    const result = writeOverText(lastKeyL, lastKeyR, text, characterSet)
    text = result.text
    if (result.characterSet != characterSet) {
      characterSet = result.characterSet
    }
    if (result.character) {
      const utterance = new SpeechSynthesisUtterance(result.character);
      window.speechSynthesis.speak(utterance);
    }
    lastKeyL = null
    lastKeyR = null
    scrollBottom('result-text')
  }

  const onKeyupL = key => {
    lastKeyL = key
    if(pressedKeyR === null) {  // this is the last keyup
      registerLastCharacter()
    }
    pressedKeyL = null
  }

  const onKeyupR = key => {
    lastKeyR = key
    if(pressedKeyL === null) {  // this is the last keyup
      registerLastCharacter()
    }
    pressedKeyR = null
  }

  const onKeyup = event => {
    if(event.code in keyboardEventCodesL) {
      onKeyupL(keyboardEventCodesL[event.code])
    } else if(event.code in keyboardEventCodesR) {
      onKeyupR(keyboardEventCodesR[event.code])
    }
  }

  const scrollBottom = elementId => {
    const element = document.getElementById(elementId)
    element.scrollTop = element.scrollHeight
  }

  onMount(() => {
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('keyup', onKeyup)

    return () => {
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('keyup', onKeyup)
    }
  })
</script>

<svelte:window bind:innerHeight={windowHeight}/>

<main>
  <form>
    <div class="form-row align-items-center" style="height: {windowHeight}px">
    <div class="col-auto btn-group-vertical align-self-stretch">
    {#each getKeyState(pressedKeyL) as pressed, key}
      <button type="button"
        class:active={pressed}
        class="btn btn-outline-secondary" aria-pressed="{ pressed }"
        on:touchstart="{ () => onKeydownL(key) }"
        on:touchend="{ () => onKeyupL(key) }">L{ key }</button>
    {/each}
    </div>
    <div class="col align-self-stretch">
      <div class="form-group">
        <label for="result-text">Result</label>
        <textarea class="form-control align-self-stretch" id="result-text" readonly>{text}</textarea>
      </div>
    </div>
    <div class="col-auto btn-group-vertical align-self-stretch">
    {#each getKeyState(pressedKeyR) as pressed, key}
      <button type="button"
        class:active={pressed}
        class="btn btn-outline-secondary" aria-pressed="{ pressed }"
        on:touchstart="{ () => onKeydownR(key) }"
        on:touchend="{ () => onKeyupR(key) }">R{ key }</button>
    {/each}
    </div>
  </div></form>
</main>
