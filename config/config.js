const APP_CONFIG_DATA = {
  initial_co2_emissions: 158,
  max_indicator_width: 300, // Used for reference, but ice cube has its own sizing
  min_indicator_width: 30, 
  indicator_aspect_ratio: 1,
  label_offset_from_ring: 8,
  scaling_exponent: 2,
  savings_goals: [
    { "id": "goal_16mt", "value": 16, "label": "16 Mt bespaard" },
  ]
};

const ALL_MEASURES_DATA_JS = 
[
	{ "id": "measure_1", "name": "Minder vlees eten (2 dagen/week)", "co2_impact": 2.5, "active": false },
	{ "id": "measure_2", "name": "Alle bestelauto's elektrisch", "co2_impact": 3.0, "active": false },
	{ "id": "measure_3", "name": "Sluiten kolencentrales (na 2030)", "co2_impact": 6.0, "active": false },
	{ "id": "measure_4", "name": "Minder vliegen (20% reductie)", "co2_impact": 2.2, "active": false },
	{ "id": "measure_5", "name": "Isolatieprogramma woningen", "co2_impact": 1.5, "active": false },
	{ "id": "measure_6", "name": "Verbod op korte afstandsvluchten", "co2_impact": 1.0, "active": false },
	{ "id": "measure_7", "name": "Stimuleren thuiswerken (3 dagen/week)", "co2_impact": 0.8, "active": false },
	{ "id": "measure_8", "name": "Versnellen duurzame energie opwek", "co2_impact": 4.5, "active": false },
	{ "id": "measure_9", "name": "Schoolgebouwen energiezuinig maken", "co2_impact": 1.1, "active": false },
	{ "id": "measure_10", "name": "Gratis OV voor scholieren en studenten", "co2_impact": 0.9, "active": false }
];
