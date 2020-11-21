<template>
  <div>
    <div v-if="wizardComplete">

      <div class="card mx-auto text-white bg-secondary mb-3 text-center w-75">
        <div class="card-header"><h1>Neural network predicted wine rating</h1></div>
        <div class="card-body">
          <h3 class="card-text">{{wineRating}}</h3>
        </div>
      </div>

      <div class="card mx-auto text-white bg-secondary mb-3 text-center w-75">
        <div class="card-body">
          <h5 class="card-title">Model input</h5>
          <pre class="card-text text-white">{{modelPretty}}</pre>
        </div>
      </div>

      <a class="btn btn-primary" @click="restartWizard">Restart wizard</a>
    </div>

    <div v-else>
      <h1>Enter wine details to get predicted rating</h1>
      <form-wizard
        :title="title"
        :subtitle="subtitle"
        :nextButtonText="nextButtonText"
        :backButtonText="backButtonText"
        :finishButtonText="finishButtonText"
        :color="color"
        :errorColor="errorColor"
        @on-complete="onComplete"
      >
        <tab-content title="Wine details">
          <vue-form-generator
            :model="model"
            :schema="wineDetailsSchema"
            :options="formOptions"
          >
          </vue-form-generator>
        </tab-content>
        <tab-content title="Regional information">
          <vue-form-generator
            :model="model"
            :schema="wineRegionSchema"
            :options="formOptions"
          >
          </vue-form-generator>
        </tab-content>
        <tab-content title="Price">
          <vue-form-generator
            :model="model"
            :schema="winePriceSchema"
            :options="formOptions"
          >
          </vue-form-generator>
        </tab-content>
      </form-wizard>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg-core.css'
import 'vue-form-generator/dist/vfg.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'WineRater',
  components: {
    FormWizard,
    TabContent,
    'vue-form-generator': VueFormGenerator.component
  },
  data () {
    return {
      wizardComplete: false,
      wineRating: '',
      model: {
        wineType: '',
        mainGrape: '',
        cuvee: false,
        year: '',
        country: '',
        region: '',
        price: 20
      },
      modelPretty: '',
      formOptions: {
        validationErrorClass: 'has-error',
        validationSuccessClass: 'has-success',
        validateAfterChanged: true
      },
      wineDetailsSchema: {
        fields: [
          {
            type: 'select',
            label: 'Wine type',
            model: 'wineType',
            values: [],
            required: true,
            validator: VueFormGenerator.validators.string,
            styleClasses: 'col-xs-3'
          },
          {
            type: 'select',
            label: 'Main Grape',
            model: 'mainGrape',
            values: [],
            required: true,
            validator: VueFormGenerator.validators.string,
            styleClasses: 'col-xs-3'
          },
          {
            type: 'switch',
            label: 'Is cuvee',
            model: 'cuvee',
            values: [],
            required: true,
            default: false,
            textOn: 'Cuvee',
            textOff: 'Single varietal',
            validator: VueFormGenerator.validators.boolean,
            styleClasses: 'col-xs-3'
          },
          {
            type: 'select',
            label: 'Year',
            model: 'year',
            values: [],
            required: true,
            validator: VueFormGenerator.validators.number,
            styleClasses: 'col-xs-3'
          }
        ]
      },
      wineRegionSchema: {
        fields: [
          {
            type: 'select',
            label: 'Country',
            model: 'country',
            values: [],
            required: true,
            validator: VueFormGenerator.validators.string,
            styleClasses: 'col-xs-6'
          },
          {
            type: 'select',
            label: 'Region',
            model: 'region',
            values: [],
            required: true,
            validator: VueFormGenerator.validators.string,
            styleClasses: 'col-xs-6'
          }
        ]
      },
      winePriceSchema: {
        fields: [
          {
            type: 'input',
            inputType: 'number',
            label: 'Price',
            model: 'price',
            min: 1,
            max: 100,
            required: true,
            validator: VueFormGenerator.validators.number,
            styleClasses: 'col-xs-12'
          }
        ]
      }
    }
  },

  mounted () {
    axios
      .get(process.env.VUE_APP_API + '/types')
      .then((response) => (this.wineDetailsSchema.fields[0].values = response.data))

    axios
      .get(process.env.VUE_APP_API + '/grapes')
      .then((response) => (this.wineDetailsSchema.fields[1].values = response.data))

    axios
      .get(process.env.VUE_APP_API + '/years')
      .then((response) => (this.wineDetailsSchema.fields[3].values = response.data))

    axios
      .get(process.env.VUE_APP_API + '/countries')
      .then((response) => (this.wineRegionSchema.fields[0].values = response.data))

    axios
      .get(process.env.VUE_APP_API + '/regions')
      .then((response) => (this.wineRegionSchema.fields[1].values = response.data))
  },

  methods: {
    onComplete: function () {
      this.wizardComplete = true
      this.modelPretty = JSON.stringify(this.model, undefined, 2)

      axios
        .post(process.env.VUE_APP_API + '/rating', {
          'price_chf': this.model.price,
          'year': this.model.year,
          'type': this.model.wineType,
          'country': this.model.country,
          'region': this.model.region,
          'main_grape': this.model.mainGrape,
          'cuvee': this.model.cuvee
        })
        .then((response) => (this.wineRating = response.data.rating))
    },

    restartWizard: function () {
      this.wizardComplete = false
    }
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    nextButtonText: {
      type: String,
      default: 'Next'
    },
    backButtonText: {
      type: String,
      default: 'Back'
    },
    finishButtonText: {
      type: String,
      default: 'Predict wine rating'
    },
    color: {
      type: String,
      default: '#b9cef9'
    },
    errorColor: {
      type: String,
      default: '#8b0000'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #b9cef9;
}

</style>
