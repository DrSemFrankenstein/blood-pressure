import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  age: null,
  weight: null,
  height: null,
  systolic: null,
  diastolic: null,
  heartRate: null,
  bmi: null,
  generalConclusion: 'Normal', // Default to "Normal"
};

const bloodPressureSlice = createSlice({
  name: 'bloodPressure',
  initialState,
  reducers: {
    updateBloodPressureData: (state, action) => {
      const { age, weight, height, systolic, diastolic, heartRate, bmi, generalConclusion } = action.payload;
      state.age = age;
      state.weight = weight;
      state.height = height;
      state.systolic = systolic;
      state.diastolic = diastolic;
      state.heartRate = heartRate;
      state.bmi = bmi;
      state.generalConclusion = generalConclusion;
    },
  },
});

export const { updateBloodPressureData } = bloodPressureSlice.actions;
export default bloodPressureSlice.reducer;
