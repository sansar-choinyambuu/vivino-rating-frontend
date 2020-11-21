# vivino-rating-frontend

> Predict vivino rating for wines

This is a very simple vuejs frontend for predicting rating for wines.
Couple of input parameters must be provided by the user. The application sends the input parameters to the backend REST API and displays the predicted rating for the given wine.

The backend is provided with https://github.com/sansar-choinyambuu/vivino-rating-backend

The machine learning model used by the backend was trained with data scraped from [vivino.com](https://www.vivino.com/) using [vivino-scraper](https://github.com/sansar-choinyambuu/vivino-scraper)
More information in vivino data analysis in: https://github.com/sansar-choinyambuu/vivino-analysis 

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```