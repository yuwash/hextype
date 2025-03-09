const keyCombinationCodes = {
  // left -> right -> code
  null: {
    null: 0,
    0: 1,
    1: 2,
    2: 3,
  },
  0: {
    null: 4,
    0: 5,
    1: 6,
    2: 7,
  },
  1: {
    null: 8,
    0: 9,
    1: 10,
    2: 11,
  },
  2: {
    null: 12,
    0: 13,
    1: 14,
    2: 15,
  },
}

const keyMap = {
  0: '\0',  // not really used
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '0',
  9: '\b',  // backspace
  10: '\x0e',  // alternative character set
  11: '\x0f',  // another alternative character set
  12: ' ',
  13: '8',
  14: '9',
  15: '\n',  // carriage return -> new line
}

export const getCharacter = (keyL, keyR) => {
  const subMap = keyCombinationCodes[keyL]
  if(!subMap) {
    return null
  }
  return keyMap[subMap[keyR]]
}

export const writeOverText = (keyL, keyR, text, dispatch, cursor=null) => {
  if(cursor === null) {
    cursor = text.length
  }
  const character = getCharacter(keyL, keyR)
  if(!character) {
    return text  // key combination ignored
  } else if(character === '\b') {
    return text.substring(0, cursor - 1) + text.substring(cursor)
  } else if(character === '\x0e') {
    dispatch('characterSetChange', 0x0e)
    return text
  } else if(character === '\x0f') {
    dispatch('characterSetChange', 0x0f)
    return text
  } else {
    return text.substring(0, cursor) + character + text.substring(cursor)
  }
}
