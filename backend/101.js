var myMap;

ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: []
    });

    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', () => {
        const billboards = document.getElementById('billboards');
        const billboardsError = document.getElementById('billboards-error');
        const billboardsValue = parseInt(billboards.value);

        if (isNaN(billboardsValue) || billboardsValue < 1 || billboardsValue > 11807) {
            billboards.classList.add('is-invalid');
            billboardsError.textContent = 'Количество билбордов должно быть целым числом от 1 до 11807';
            return;
        } else {
            billboards.classList.remove('is-invalid');
            billboardsError.textContent = '';
        }

        const gender = document.getElementById('gender').value.split(', ');
        const income = document.getElementById('income').value;
        const ageGroup = document.getElementById('age-group').value;
        const district = document.getElementById('district').value.split(', ');
        const area = document.getElementById('area').value.split(', ');

        const data = {
            'gender': gender,
            'income': income,
            'ageGroup': ageGroup,
            'billboards': billboardsValue,
            'district': district,
            'area': area
        };

        fetch('http://127.0.0.1:4000/api/advertisment/coordinate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.coordinates) {
                console.log('Координаты получены:', data.coordinates);
                plotCoordinates(data.coordinates);
            } else {
                console.error('Ошибка при получении координат!');
            }
            if (data.value) {
                document.getElementById('response-value').value = data.value;
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
        });
    });
}

function plotCoordinates(coordinates) {
    myMap.geoObjects.removeAll();

    coordinates.forEach(coord => {
        const myGeoObject = new ymaps.Placemark([coord.lat, coord.lon], {
            balloonContent: 'Рандомная точка'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        });
        myMap.geoObjects.add(myGeoObject);
    });
}
