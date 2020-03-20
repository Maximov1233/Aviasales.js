const formSearch       = document.querySelector('.form-search'),
    inputCitiesFrom    = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo      = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo   = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart    = formSearch.querySelector('.input__date-depart');

const citiesApi = 'database/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'c80ddd996f50bb16db1ecd91acb55fc1',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';

// const city = ['Нұр-Сұлтан', 'Жезқазған', 'Карағанды', 'Алматы', 'Шымкент',
//     'Москва', 'Санкт-Петербург', 'Казань', 'Томск', 'Новосибирск',
//     'Екатеринбург', 'Омск', 'Магнитогорск', 'Хабаровск', 'Владивосток', 'Уфа'
// ];

let city = [];

const getData = (url, callback) => {
    const request = new XMLHttpRequest;
    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
           console.error(request.status);  
        }
    });

    request.send();
};



const showCity = (input, list) => {
    list.textContent = '';

    if (input.value === '') return;
    const filterCity = city.filter((item) => {
        const fixItem = item.name.toLowerCase();
        return fixItem.includes(input.value.toLowerCase());
    });

    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);
    });
};

const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
}

const renderCheapDay = (cheapTicket) => {

};

const renderCheapYear = (cheapTickets) => {

}

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    
    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    }); 

    renderCheapDay(cheapTicketDay);
    renderCheapYear(renderCheapYear);
}

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesFrom.addEventListener('click', () => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesTo.addEventListener('click', () => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name),
        cityTo     = city.find((item) => inputCitiesTo.value === item.name); 

    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDateDepart.value
    };

    const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true`;
    
    getData(calendar + requestData, (response) => {
        renderCheap(response, formData.when);
    });
});

getData(citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
});



// getData(calendar +
//      '?depart_date=2020-05-25&origin=SVX&destination=KGD&oneway=true&token'
//       + API_KEY, (data) => {
//     const cheapTicket = JSON.parse(data)
// });