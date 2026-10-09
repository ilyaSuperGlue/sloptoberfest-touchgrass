export const validationRules: Record<
  string,
  { positives: string[]; negatives: string[]; threshold: number }
> = {
  "Find a traffic light": {
    positives: ["a traffic light"],
    negatives: ["a road sign", "a street lamp", "a building"],
    threshold: 0.45,
  },
  "Find some grass": {
    positives: ["grass"],
    negatives: ["concrete", "sand", "a road"],
    threshold: 0.45,
  },
  "Spot a red car": {
    positives: ["a red car"],
    negatives: ["a blue car", "a black car", "a bicycle"],
    threshold: 0.45,
  },
  "Find a new leaf": {
    positives: ["a leaf"],
    negatives: ["a flower", "grass", "a plastic object"],
    threshold: 0.45,
  },
  "Find a cloud shape": {
    positives: ["a cloud in the sky"],
    negatives: ["a building", "a tree", "a clear sky"],
    threshold: 0.45,
  },
  "Find a flower": {
    positives: ["a flower"],
    negatives: ["a leaf", "grass", "a plastic object"],
    threshold: 0.45,
  },
  "Find a smooth stone": {
    positives: ["a smooth stone"],
    negatives: ["a leaf", "a piece of wood", "a plastic object"],
    threshold: 0.45,
  },
  "Find the tallest tree": {
    positives: ["a tall tree"],
    negatives: ["a bush", "a building", "a street lamp"],
    threshold: 0.45,
  },
  "Find a feather": {
    positives: ["a feather"],
    negatives: ["a leaf", "a flower", "a piece of paper"],
    threshold: 0.45,
  },
  "Find a place to sit": {
    positives: ["an outdoor chair or bench"],
    negatives: ["a bed", "a car", "a tree"],
    threshold: 0.45,
  },
  "Spot a bird": { positives: ["a bird"], negatives: ["a plane", "a leaf", "a butterfly"], threshold: 0.4 },
  "Find a butterfly or insect": { positives: ["a butterfly or small insect"], negatives: ["a bird", "a flower", "a leaf"], threshold: 0.4 },
  "Find a puddle": { positives: ["a puddle"], negatives: ["a swimming pool", "a road", "dry ground"], threshold: 0.42 },
  "Find a bridge": { positives: ["a bridge"], negatives: ["a road", "a building", "a tunnel"], threshold: 0.45 },
  "Spot a motorbike": { positives: ["a parked motorbike"], negatives: ["a bicycle", "a car", "a motorcycle"], threshold: 0.42 },
  "Find a bicycle": { positives: ["a bicycle"], negatives: ["a motorbike", "a car", "a motorcycle"], threshold: 0.45 },
  "Find a friendly pet or stray": { positives: ["a dog or cat"], negatives: ["a wild animal", "a person", "a bicycle"], threshold: 0.42 },
};
