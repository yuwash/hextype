const keyCombinationCodes = {
  // left -> right -> code
  null: {
    // null: not used because you’re not pressing any key.
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

const keyMap0xe = {
  // Assign the vowels and 'N' as another common letter to the one-key
  // combinations.
  1: 'A',
  2: 'E',
  3: 'I',
  4: 'N',
  8: 'O',
  12: 'U',
  // The rest:
  5: 'B',
  6: 'C',
  7: 'D',
  9: '\b',  // backspace
  10: '\x0d',  // back to default character set
  11: 'F',
  13: 'G',
  14: 'H',
  15: 'J',
}

const keyMap0xf = {
  1: 'K',
  2: 'L',
  3: 'M',
  4: 'P',
  5: 'Q',
  6: 'R',
  7: 'S',
  8: 'T',
  9: '\b',  // backspace
  10: '\x0d',  // back to default character set
  11: 'V',
  12: 'W',
  13: 'X',
  14: 'Y',
  15: 'Z',
}

export const getCharacter = (keyL, keyR, characterSet) => {
  const subMap = keyCombinationCodes[keyL]
  if(!subMap) {
    return null
  }
  if (characterSet === 0x0e) {
    return keyMap0xe[subMap[keyR]]
  } else if (characterSet === 0x0f) {
    return keyMap0xf[subMap[keyR]]
  } else {
    return keyMap[subMap[keyR]]
  }
}

export const writeOverText = (keyL, keyR, text, dispatch, characterSet, cursor=null) => {
  if(cursor === null) {
    cursor = text.length
  }
  const character = getCharacter(keyL, keyR, characterSet)
  if(!character) {
    return text // key combination ignored
  } else if(character === '\b') {
    return text.substring(0, cursor - 1) + text.substring(cursor)
  } else if(character === '\x0d') {
    dispatch('characterSetChange', null)
    return text
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
