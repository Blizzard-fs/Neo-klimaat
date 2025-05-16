const APP_CONFIG_DATA = {
  initial_co2_emissions: 158,
  max_ball_diameter: 300,
  min_ball_diameter: 0,
  label_offset_from_ring: 5,
  savings_goals: [
    { "id": "goal_16mt", "value": 16, "label": "16 Megaton bespaard" },
    { "id": "goal_24mt", "value": 36, "label": "24 Megaton bespaard" }
  ]
};

const ALL_MEASURES_DATA_JS = [
	{ "id": "measure_1", "name": "Minder vlees eten (2 dagen/week)", "co2_impact": 2.5, "active": false },
	{ "id": "measure_2", "name": "Alle bestelauto's elektrisch", "co2_impact": 3.0, "active": false },
	{ "id": "measure_3", "name": "1 miljoen huizen hybride warmtepomp", "co2_impact": 1.8, "active": false },
	{ "id": "measure_4", "name": "Sluiten kolencentrales (na 2030)", "co2_impact": 6.0, "active": false },
	{ "id": "measure_5", "name": "Minder vliegen (20% reductie)", "co2_impact": 2.2, "active": false },
	{ "id": "measure_6", "name": "Isolatieprogramma woningen", "co2_impact": 1.5, "active": false },
	{ "id": "measure_7", "name": "Verbod op korte afstandsvluchten", "co2_impact": 1.0, "active": false }, // Corrected typo from co_impact
	{ "id": "measure_8", "name": "Stimuleren thuiswerken (3 dagen/week)", "co2_impact": 0.8, "active": false },
	{ "id": "measure_9", "name": "Versnellen duurzame energie opwek", "co2_impact": 4.5, "active": false },
	{ "id": "measure_10", "name": "Vegetarisch aanbod op basisscholen", "co2_impact": 0.6, "active": false },
	{ "id": "measure_11", "name": "Energieeducatie in schoolcurriculum", "co2_impact": 0.3, "active": false },
	{ "id": "measure_12", "name": "Schoolgebouwen energiezuinig maken", "co2_impact": 1.1, "active": false },
	{ "id": "measure_13", "name": "Gratis OV voor scholieren en studenten", "co2_impact": 0.9, "active": false },
	{ "id": "measure_14", "name": "Autovrije zones rond scholen", "co2_impact": 0.4, "active": false },
	{ "id": "measure_15", "name": "Fietsprogramma’s voor basisschoolkinderen", "co2_impact": 0.2, "active": false },
	{ "id": "measure_16", "name": "Geen vleesdagen in schoolkantines", "co2_impact": 0.5, "active": false },
	{ "id": "measure_17", "name": "Schooltuinen stimuleren (lokale voeding)", "co2_impact": 0.1, "active": false },
	{ "id": "measure_18", "name": "Verplichting duurzame schooluitjes", "co2_impact": 0.05, "active": false },
	{ "id": "measure_19", "name": "Subsidie voor gezinsfietsen en bakfietsen", "co2_impact": 0.7, "active": false },
	{ "id": "measure_20", "name": "Energiebesparende maatregelen voor huurwoningen met kinderen", "co2_impact": 1.3, "active": false },
	{ "id": "measure_21", "name": "Duurzaamheidskorting op kinderkleding (tweedehands/hergebruik)", "co2_impact": 0.2, "active": false },
	{ "id": "measure_22", "name": "Groene kinderopvang (biologisch eten, energieneutraal gebouw)", "co2_impact": 0.4, "active": false },
	{ "id": "measure_23", "name": "Gezinnen stimuleren tot deelname aan energiegemeenschappen", "co2_impact": 0.6, "active": false },
	{ "id": "measure_24", "name": "Laadpunten bij scholen en kindcentra", "co2_impact": 0.3, "active": false },
	{ "id": "measure_25", "name": "Milieuvriendelijke gezinsvakanties stimuleren (NL/trein)", "co2_impact": 0.5, "active": false },
	{ "id": "measure_26", "name": "Woningisolatie verplicht bij gezinsuitbreiding", "co2_impact": 0.8, "active": false },
	{ "id": "measure_27", "name": "Verplichte energielabel A voor gezinswoningen vanaf 2028", "co2_impact": 1.7, "active": false },
	{ "id": "measure_28", "name": "Stimuleringsregeling deelauto’s voor gezinnen", "co2_impact": 0.9, "active": false }
];
