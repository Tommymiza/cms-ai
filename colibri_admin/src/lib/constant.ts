export const Role = {
  ADMIN: 'strapi-super-admin',
  USER: 'strapi-author',
}

export const languages: { [x: string]: string } = {
  en: 'English',
  fr: 'Français',
}

export const ACCEPTED_IMAGE_PROFILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const MAX_SIZE_IMAGE_PROFILE = 1024 * 1024 * 5
