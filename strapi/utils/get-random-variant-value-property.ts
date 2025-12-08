export function getRandomVariant(menuObject: any) {
    const variants = menuObject.variant;
    const randomIndex =
      crypto.getRandomValues(new Uint32Array(1))[0] % variants.length;
    return variants[randomIndex];
  }