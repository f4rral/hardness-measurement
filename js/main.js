'use strict'

let values = {
  coefK: null,
  diaBall: null,
  holdTime: null,
  force: null,
  dia1: null,
  dia2: null,
  hardness: null,
};

const DATA = [
  { 
    coef: 30,
    force: [[1, 30], [2, 120], [2.5, 187], [5, 750], [10, 3000]]
  },
  {
    coef: 15,
    force: [[10, 1500]]
  },
  {
    coef: 10,
    force: [[1, 10], [2, 40], [2.5, 62.5], [5, 250], [10, 1000]]
  },
  {
    coef: 5,
    force: [[1, 5], [2, 20], [2.5, 31.2], [5, 150], [10, 500]]
  },
  {
    coef: 2.5,
    force: [[1, 2.5], [2, 10], [2.5, 15.6], [5, 62.5], [10, 250]]
  },
  {
    coef: 1,
    force: [[1, 1], [2, 4], [2.5, 6.2], [5, 25], [10, 100]]
  }
];

let formHardness = document.querySelector('.js-form-hardness');

formHardness.onchange = function(event) {
  values = calcHardness(getValuesForm());
  displayState(values);
};

// получения значений
function getValuesForm() {

  let formData = new FormData(formHardness);
  let form = {};

  form.coefK = + formData.get('material') || null;
  form.dia1 = + formData.get('dia1') || null;
  form.dia2 = + formData.get('dia2') || null;
  form.holdTime = formData.get('hardness') || null;

  form.diaBall = + formData.get('diaBall') || values.diaBall || null;

  return form;
}

// расчет
function calcHardness(values) {

  let force = [];
  if (values.coefK && values.diaBall) {
    force = DATA.find(elem => elem.coef == values.coefK)
    .force.find(elem => elem[0] == values.diaBall) || [];

    values.force = force[1];
  }

  let midDia;
  if (values.dia1 && values.dia2) {
    midDia = (values.dia1 + values.dia2) / 2;
  }

  let hardness = (2 * values.force) / (Math.PI * values.diaBall 
    * (values.diaBall - Math.sqrt(values.diaBall**2 - midDia**2)));

  values.hardness = isFinite(hardness) ? hardness : null;

  return values;
}

// отображение состояния
function displayState(values) {

  setDiaBallValue();

  document.querySelector('.js-coef-k').innerHTML = values.coefK || '-';
  document.querySelector('.js-force').innerHTML = values.force || '-';
  document.querySelector('.js-hold-time').innerHTML = values.holdTime || '-';

  if (values.hardness) {
    document.querySelector('.js-hardness').innerHTML = values.hardness.toFixed(2);
  } else {
    document.querySelector('.js-hardness').innerHTML = '-';
  }
    
  // заполнение возможных диаметров шарика
  function setDiaBallValue() {

    if (!values.coefK) return;

    let ballDia = document.querySelector('.js-dia-ball');

    ballDia.innerHTML = '<option value="null">-</option>';

    DATA.find(elem => elem.coef == values.coefK)
    .force.forEach((elem) => {

      let option = document.createElement('option');
      option.value = option.innerHTML = elem[0];

      if (values.diaBall == elem[0]) option.selected = true;
      
      ballDia.append(option);
    });
  }
}