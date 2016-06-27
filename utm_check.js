function printResult(){
    result = checkUtm();

    if (result.status === "not_equal_length") {
        var resultDiv = renderItem('div', 'failed', 'content-block');

        var messages = ['UTM-метки содержат разное кол-во параметров!',
                        'Ожидаемое кол-во элементов: ' + result.expected_count,
                        'Фактическое кол-во элементаов: ' + result.actual_count
        ]

        for (var i = 0; i < messages.length; i++) {
           renderTextItems('div', resultDiv, messages[i]);
        }


    } else if (result.status === false) {
        var resultDiv = renderItem('div', 'failed', 'content-block');

        var messages = ['UTM-метки не совпадают!',
                        'Ожидаемые элменеты: ' + result.expected_utms,
                        'Элементы, которые не найдены: ' + result.compare_result
        ]
        
        for (var i = 0; i < messages.length; i++) {
           renderTextItems('div', resultDiv, messages[i]);
        }

    } else {
        renderItem("div", "success", "content-block", result.message);
    }

}

function checkUtm() {
   var utmExpected = document.getElementById('expected_utm_field').value;
   var utmActual = document.getElementById('actual_utm_field').value;
   var expectedUtms = utmExpected.split('&');
   var actualUtms = utmActual.split('&');

   // if (utmExpected.length && utmActual.length === 0) {
   //      return {
   //          "status": 
   //      }
   // }

   if (!(expectedUtms.length === actualUtms.length)) {
        return {
            "status": "not_equal_length",
            "expected_count": expectedUtms.length,
            "actual_count": actualUtms.length
        }
    }

    var compareResult = []; 
    for (var i = 0; i < expectedUtms.length; i++) {
        if (expectedUtms.includes(actualUtms[i])) continue;
        compareResult.push(actualUtms[i]);
    }

    if (compareResult.length === 0) {
        return {
            "status": true,
            "message": "UTM-метки полностью совпадают"
        }
    }

    return {
        "status": false,
        "expected_utms": expectedUtms,
        "compare_result": compareResult
    }
}

function renderItem(item, itemClass, parentItemId, message) {
    var resultItem = document.createElement(item);
    resultItem.className = itemClass;
    document.getElementById(parentItemId).appendChild(resultItem);

    if (message) {
        resultItem.appendChild(document.createTextNode(message));
    }

    return resultItem;
}

function renderTextItems(item, parentItem, message) {
    var resultItem = document.createElement(item);
    parentItem.appendChild(resultItem);
    resultItem.appendChild(document.createTextNode(message));
}
