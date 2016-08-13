function runPrintResult(e) {
    if (e.keyCode == 13) {
        printResult()
    }
}

function printResult() {
    var itemClass = 'successed';
    var messages = ['GET-параметры полностью совпадают!'];

    clearMessages();
    var expectedUtms = getFieldValue('expected_utm_field', 'expected_block');
    var actualUtms = getFieldValue('actual_utm_field', 'actual_block');
    result = checkArrays(expectedUtms, actualUtms);

    if (result.status === 'emtpy') return;

    if (result.status === 'not_equal_length') {
        itemClass = 'failed';
        messages = ['GET-параметры не совпадают по длинне!',
                    'Ожидаемое кол-во элементов: ' + expectedUtms.length,
                    'Фактическое кол-во элементаов: ' + actualUtms.length
        ];
    }

    if (result.status === false) {
        itemClass = 'failed';
        messages = ['GET-параметры не совпадают!'];
    }

    if (result.notInExpectedList.length != 0) {
        messages.push('Фактический набор не должен содержать элементы: ' + result.notInExpectedList.sort());
    }
    if (result.notInActualList.length != 0) {
        messages.push('Элементы, которые отсутствуют: ' + result.notInActualList.sort());
    }

    var resultDiv = renderItem('div', itemClass, 'result', 'content-block');
    for (var i = 0; i < messages.length; i++) {
        renderTextItems('div', resultDiv, messages[i]);
    }

    renderTextItems('div', resultDiv, 'Ожидаемая последовательность: ');
    for (var i = 0; i < expectedUtms.length; i++) {
        let className = 'success';
        if (result.notInActualList.includes(expectedUtms[i])) {
            className = 'suspect'
        }
        renderTextItems('mark', resultDiv, expectedUtms[i] + ', ', className);
    }

    renderTextItems('div', resultDiv, 'Фактическая последовательность: ');
    for (var i = 0; i < actualUtms.length; i++) {
        let className = 'success';
        if (result.notInExpectedList.includes(actualUtms[i])) {
            className = 'fail'
        }
        renderTextItems('mark', resultDiv, actualUtms[i] + ', ', className);
    }
}

function getFieldValue(fieldId, parentFieldId) {
   var fieldValue = document.getElementById(fieldId).value;
   var parentBlock = document.getElementById(parentFieldId);
   if (fieldValue.length == 0) {
        renderAlert(parentBlock, fieldId, 'alert_'+parentFieldId);
        return []
   }
   var a = document.createElement('a');
   a.href = fieldValue;
   if (Boolean(a.search)) {
        return a.search.slice(1).split('&');
   }
   if (fieldValue.charAt(0) == '?') {
        fieldValue = fieldValue.slice(1);
   }
        return fieldValue.split('&');
}

function checkArrays(expectedList, actualList) {
    var status = true;
    var notInExpectedList = [];
    var notInActualList = [];


    for (var i = 0; i < expectedList.length; i++) {
        if (!actualList.includes(expectedList[i])) {
            notInActualList.push(expectedList[i]);
        }
    }

    for (var i = 0; i < actualList.length; i++) {
        if (!expectedList.includes(actualList[i])) {
            notInExpectedList.push(actualList[i]);
        }
    }
 
    if ((expectedList.length != actualList.length)) {
        status = 'not_equal_length';
    } else if ((notInExpectedList.length || notInActualList.length) > 0) {
        status = false;
    } else if ((expectedList.length && expectedList.length) == 0) {
        status = 'emtpy'
    }
    console.log(status);
    return {
        'status': status,
        'notInExpectedList': notInExpectedList,
        'notInActualList': notInActualList
    }
}

function renderItem(item, itemClass, itemId, parentItemId) {
    var resultItem = document.createElement(item);
    resultItem.className = itemClass;
    resultItem.id = itemId;
    document.getElementById(parentItemId).appendChild(resultItem);
    return resultItem;
}

function renderTextItems(item, parentItem, message, itemClass, itemId) {
    var resultItem = document.createElement(item);
    if (itemClass) resultItem.className = itemClass;
    if (itemId) resultItem.id = itemId;
    parentItem.appendChild(resultItem);
    resultItem.appendChild(document.createTextNode(message));
}

function renderAlert(parentItem, inputId, alertId) {
    message = 'Поле не должно быть пустым!';
    itemClass = 'alert';
    document.getElementById(inputId).setAttribute('alert-state', 'true');
    renderTextItems('span', parentItem, message, itemClass, alertId);

}

function clearMessages() {
    var resultDiv = document.getElementById('result');
    if (resultDiv) {
        document.getElementById('content-block').removeChild(resultDiv);
    }

    var expectedAlertMessage = document.getElementById('alert_expected_block');
    if (expectedAlertMessage) {
        document.getElementById('expected_block').removeChild(expectedAlertMessage);
    }

    var actualAlertMessage = document.getElementById('alert_actual_block');
    if (actualAlertMessage) {
        document.getElementById('actual_block').removeChild(actualAlertMessage);
    }

    expected_utm_field = document.getElementById('expected_utm_field');
    if (expected_utm_field.getAttribute('alert-state') == 'true') {
        expected_utm_field.setAttribute('alert-state', 'false');
    }

    actual_utm_field = document.getElementById('actual_utm_field');
    if (actual_utm_field.getAttribute('alert-state') == 'true') {
        actual_utm_field.setAttribute('alert-state', 'false');
    }
}
