import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

const initialSupplements = [
    { id: '1', name: "Animal Cuts (Wake Up)", stock: 32, alert: 10, daily: 1, unit: "packs", time: "Wake Up", scheduleTime: "05:45", lastNotifiedDate: null },
    { id: '2', name: "Nutrex EAA", stock: 25, alert: 7, daily: 1, unit: "servs", time: "Intra-Workout", scheduleTime: "06:30", lastNotifiedDate: null },
    { id: '3', name: "ISO 100 Protein", stock: 2140, alert: 320, daily: 1, unit: "scoop", time: "Post-Workout", scheduleTime: "07:45", lastNotifiedDate: null },
    { id: '4', name: "Nutrex Creatine", stock: 975, alert: 100, daily: 5, unit: "g", time: "Post-Workout", scheduleTime: "07:45", lastNotifiedDate: null },
    { id: '5', name: "AllMax Glutamine (Post-Workout)", stock: 350, alert: 50, daily: 5, unit: "g", time: "Post-Workout", scheduleTime: "07:45", lastNotifiedDate: null },
    { id: '6', name: "Life Extension Multi", stock: 110, alert: 20, daily: 2, unit: "caps", time: "Breakfast", scheduleTime: "08:30", lastNotifiedDate: null },
    { id: '7', name: "Omega-3 Fish Oil", stock: 165, alert: 30, daily: 3, unit: "caps", time: "Breakfast", scheduleTime: "08:30", lastNotifiedDate: null },
    { id: '8', name: "Vitamin D3 - 5000 IU", stock: 235, alert: 20, daily: 1, unit: "caps", time: "Breakfast", scheduleTime: "08:30", lastNotifiedDate: null },
    { id: '9', name: "Animal Cuts (Pre-Lunch)", stock: 32, alert: 10, daily: 1, unit: "packs", time: "30 mins before eating", scheduleTime: "12:30", lastNotifiedDate: null },
    { id: '10', name: "ZMA", stock: 165, alert: 30, daily: 3, unit: "caps", time: "30 mins before bed", scheduleTime: "21:30", lastNotifiedDate: null },
    { id: '11', name: "AllMax Glutamine (Night)", stock: 350, alert: 50, daily: 5, unit: "g", time: "Empty stomach", scheduleTime: "21:30", lastNotifiedDate: null },
    { id: '12', name: "BPI CLA + Carnitine", stock: 50, alert: 10, daily: 1, unit: "servs", time: "6:00 AM (30 mins Pre-Workout)", scheduleTime: "06:00", lastNotifiedDate: null }
];

const initialMeals = [
    { id: '101', time: "05:45 AM", name: "Pre-Workout Snack", desc: "1 plain rice cake or 1/2 banana for baseline glucose stability.", scheduleTime: "05:45" },
    { id: '102', time: "08:30 AM", name: "Post-Workout Breakfast", desc: "Tunisian Ojja (3 whole eggs cooked in fresh tomatoes, garlic, peppers, 1 tbsp olive oil) served with 1/2 cup oats.", scheduleTime: "08:30" },
    { id: '103', time: "01:00 PM", name: "Lunch Block", desc: "Lablabi Bowl (200g seasoned chickpeas, cumin, garlic, lemon) combined with 1 can of sardines for high-density recovery protein.", scheduleTime: "13:00" },
    { id: '104', time: "03:30 PM", name: "Mid-Day Snack", desc: "150g Baladna High-Protein Greek Yogurt blended with 1 tbsp Chia Seeds.", scheduleTime: "15:30" },
    { id: '105', time: "08:30 PM", name: "Dinner Block", desc: "200g pan-seared Beef Sirloin Steak cooked with garlic butter, served with a clean side of traditional Slata Mechouia.", scheduleTime: "20:30" }
];

const initialWorkouts = [
    {
        dayId: "day1",
        name: "Day 1: Upper Body Push (Machine/DB - SI Sparing)",
        exercises: [
            { id: nanoid(), name: "Incline Dumbbell Bench Press", sets: 4, target: "8-10 reps", weight: 25, rpe: 8, tip: "Keep bench at 30 degrees. Ensure feet are planted firmly but do not arch lower spine off pad.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Seated Dumbbell Shoulder Press", sets: 3, target: "8-10 reps", weight: 18, rpe: 8, tip: "Keep lower back pressed flat into back support to eliminate stabilization demand on pelvis.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Flat Machine Chest Press", sets: 3, target: "10-12 reps", weight: 50, rpe: 8, tip: "Fully supported movement track. Focus entirely on the eccentric muscle tear.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Dumbbell Lateral Raises", sets: 4, target: "15 reps", weight: 7.5, rpe: 9, tip: "Perform seated to eliminate leg/lumbar momentum entirely.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Overhead Cable Triceps Extensions", sets: 3, target: "12-15 reps", weight: 20, rpe: 8.5, tip: "Keep core locked. Elbows high.", notes: "", isCompleted: false }
        ]
    },
    {
        dayId: "day2",
        name: "Day 2: Lower Body (Stable Machine Isolation Phase 1)",
        exercises: [
            { id: nanoid(), name: "Lying Leg Curls (Machine)", sets: 4, target: "12-15 reps", weight: 27, rpe: 9, tip: "Keep hips pinned flat to the pad.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Leg Extensions (Machine)", sets: 4, target: "12-15 reps", weight: 40, rpe: 8.5, tip: "Violent contraction at apex. Complete quad isolation.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Bodyweight Glute Bridge (Mat)", sets: 3, target: "15 reps", weight: 0, rpe: 7, tip: "Raise hips slowly. Stop if SI discomfort triggers.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Seated Calf Raises (Machine)", sets: 4, target: "15-20 reps", weight: 30, rpe: 9, tip: "Hold bottom stretch position for 2 full seconds per rep.", notes: "", isCompleted: false }
        ]
    },
    {
        dayId: "day3",
        name: "Day 3: Upper Body Pull (Supported Torso Paths)",
        exercises: [
            { id: nanoid(), name: "Wide Grip Lat Pulldowns", sets: 4, target: "10-12 reps", weight: 57, rpe: 8, tip: "Pull bar down cleanly to collarbone.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Seated Chest-Supported Cable Rows", sets: 3, target: "10-12 reps", weight: 45, rpe: 8, tip: "Pad must remain locked against chest.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Rope Face Pulls", sets: 3, target: "15-20 reps", weight: 15, rpe: 8.5, tip: "Pull rope directly to forehead.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Dumbbell Hammer Curls", sets: 3, target: "12-15 reps", weight: 14, rpe: 9, tip: "Keep posture completely vertical.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Bird-Dog Extensions", sets: 3, target: "12 reps/side", weight: 0, rpe: 7, tip: "Superb core stabilization exercise. Avoid structural twisting.", notes: "", isCompleted: false }
        ]
    },
    {
        dayId: "day4",
        name: "Day 4: Deep Active Recovery & Static Stabilization",
        exercises: [
            { id: nanoid(), name: "Brisk Flat Outdoor Walk", sets: 1, target: "30-45 mins", weight: 0, rpe: 6, tip: "Maintain a comfortable, fluid gait.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Dead-Bug Mat Core Integration", sets: 3, target: "12 reps/side", weight: 0, rpe: 8, tip: "Press your lower spine firmly flat into the floor.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Cat-Cow Mobilization Sequence", sets: 1, target: "10 clean cycles", weight: 0, rpe: 5, tip: "Extremely gentle range of motion through pelvis.", notes: "", isCompleted: false }
        ]
    },
    {
        dayId: "day5",
        name: "Day 5: Lower Body (Stable Machine Isolation Phase 2)",
        exercises: [
            { id: nanoid(), name: "Seated Leg Press (Horizontal Path)", sets: 3, target: "12-15 reps", weight: 100, rpe: 8, tip: "Place feet mid-pad. Keep your lower spine flat.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Lying Leg Curls", sets: 3, target: "12-15 reps", weight: 27, rpe: 8.5, tip: "Smooth negatives down.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Standing Calf Raises (Machine)", sets: 4, target: "15-20 reps", weight: 40, rpe: 9, tip: "Drive up directly through big toe alignment.", notes: "", isCompleted: false }
        ]
    },
    {
        dayId: "day6",
        name: "Day 6: Hypertrophy Arms & Delts (Fully Seated)",
        exercises: [
            { id: nanoid(), name: "Seated Cable Triceps Pushdowns", sets: 3, target: "12-15 reps", weight: 25, rpe: 9, tip: "Keep upper body anchored tight.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Seated Alternate Dumbbell Bicep Curls", sets: 3, target: "12 reps", weight: 12, rpe: 8.5, tip: "Supinate wrist strongly.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Seated Incline Dumbbell Curls", sets: 3, target: "12 reps", weight: 10, rpe: 9, tip: "Deep structural stretch element.", notes: "", isCompleted: false },
            { id: nanoid(), name: "Seated Dumbbell Lateral Raises", sets: 3, target: "15 reps", weight: 7.5, rpe: 9, tip: "Maintain continuous strict form execution.", notes: "", isCompleted: false }
        ]
    },
    {
        dayId: "day7",
        name: "Day 7: Full System Neurological Reset",
        exercises: [
            { id: nanoid(), name: "Total Passive Rest & Advanced Hydration", sets: 1, target: "24 Hours", weight: 0, rpe: 0, tip: "Focus explicitly on diet adherence and systemic physical recovery.", notes: "", isCompleted: false }
        ]
    }
];

export const useStore = create(
    persist(
        (set, get) => ({
            profile: {
                siJointPain: true,
                apiKey: "",
                goals: "Maximum safe muscle building and metabolic performance optimization.",
            },
            history: [],
            currentWeek: 1,
            telemetry: { energy: 8, sleep: 7 },
            supplements: initialSupplements,
            meals: initialMeals,
            workouts: initialWorkouts,
            chatHistory: [],
            scannedMeals: [],

            // Actions
            updateProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),
            updateTelemetry: (updates) => set((state) => ({ telemetry: { ...state.telemetry, ...updates } })),
            
            updateSupplement: (id, updates) => set((state) => ({
                supplements: state.supplements.map(s => s.id === id ? { ...s, ...updates } : s)
            })),
            addSupplement: (supp) => set((state) => ({
                supplements: [...state.supplements, { id: nanoid(), ...supp }]
            })),
            deleteSupplement: (id) => set((state) => ({
                supplements: state.supplements.filter(s => s.id !== id)
            })),

            updateMeal: (id, updates) => set((state) => ({
                meals: state.meals.map(m => m.id === id ? { ...m, ...updates } : m)
            })),
            addMeal: (meal) => set((state) => ({
                meals: [...state.meals, { id: nanoid(), ...meal }]
            })),
            deleteMeal: (id) => set((state) => ({
                meals: state.meals.filter(m => m.id !== id)
            })),

            updateExercise: (dayId, exerciseId, updates) => set((state) => ({
                workouts: state.workouts.map(w => {
                    if (w.dayId !== dayId) return w;
                    return {
                        ...w,
                        exercises: w.exercises.map(e => e.id === exerciseId ? { ...e, ...updates } : e)
                    };
                })
            })),
            addExercise: (dayId, exercise) => set((state) => ({
                workouts: state.workouts.map(w => {
                    if (w.dayId !== dayId) return w;
                    return { ...w, exercises: [...w.exercises, { id: nanoid(), ...exercise }] };
                })
            })),
            deleteExercise: (dayId, exerciseId) => set((state) => ({
                workouts: state.workouts.map(w => {
                    if (w.dayId !== dayId) return w;
                    return { ...w, exercises: w.exercises.filter(e => e.id !== exerciseId) };
                })
            })),

            addChatMessage: (message) => set((state) => ({
                chatHistory: [...state.chatHistory, message]
            })),

            addScannedMeal: (meal) => set((state) => ({
                scannedMeals: [...state.scannedMeals, { id: nanoid(), dateLogged: new Date().toISOString(), ...meal }]
            })),
            deleteScannedMeal: (id) => set((state) => ({
                scannedMeals: state.scannedMeals.filter(m => m.id !== id)
            })),

            generateNextWeek: (newWorkouts) => set((state) => {
                const historyEntry = {
                    week: state.currentWeek,
                    telemetry: state.telemetry,
                    workouts: state.workouts,
                    scannedMeals: state.scannedMeals,
                    dateLogged: new Date().toISOString()
                };
                
                const processedWorkouts = newWorkouts.map(w => ({
                    ...w,
                    exercises: w.exercises.map(ex => ({
                        ...ex,
                        id: ex.id || nanoid(),
                        isCompleted: false
                    }))
                }));
                
                return {
                    history: [...state.history, historyEntry],
                    currentWeek: state.currentWeek + 1,
                    workouts: processedWorkouts,
                    scannedMeals: [] // Clear scanned meals on new week
                };
            }),
            
            importData: (data) => set(() => data),
        }),
        { 
            name: 'jen-fitness-app-storage',
            version: 4
        }
    )
);
