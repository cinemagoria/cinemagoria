<template>
    <div class="filter-item">
      <label for="year" style="font-size: 14px; color: #acafb5">Año de Lanzamiento</label>
      <div class="custom-select" style="top: 7px;">
        <select v-model="selectedYear" @change="emitChange" id="year">
          <option value="">Opcional</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <div class="select-arrow"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'YearPicker',
    props: {
      value: {
        type: [String, Number, Date],
        default: ''
      },
      minYear: {
        type: Number,
        default: 1888
      }
    },
    data() {
      return {
        selectedYear: this.formatValue(this.value)
      };
    },
    computed: {
      availableYears() {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= this.minYear; year--) {
          years.push(year);
        }
        return years;
      }
    },
    watch: {
      value(newVal) {
        this.selectedYear = this.formatValue(newVal);
      }
    },
    methods: {
      formatValue(val) {
        if (!val) return '';
        if (val instanceof Date) return val.getFullYear().toString();
        return val.toString();
      },
      emitChange() {
        if (!this.selectedYear) {
          this.$emit('input', '');
          return;
        }
        
        if (this.value instanceof Date) {
          const newDate = new Date(parseInt(this.selectedYear, 10), 0, 1);
          this.$emit('input', newDate);
        } else {
          this.$emit('input', this.selectedYear);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .custom-select {
    position: relative;
    width: 100%;
  }
  
  .custom-select select {
    appearance: none;
    width: 100%;
    padding: 12px 16px;
    background: rgba(8, 45, 62, 0.3);
    border: 1px solid rgba(127, 219, 241, 0.3);
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 45px;
  }
  
  .custom-select select:hover {
    background: rgba(8, 45, 62, 0.5);
    border-color: rgba(127, 219, 241, 0.5);
  }
  
  .custom-select select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2);
    border-color: #7FDBF1;
  }
  
  .select-arrow {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #7FDBF1;
    pointer-events: none;
  }
  </style>