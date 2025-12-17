export const MAX_IMAGES = 10;

export const ANNOUNCEMENT_TYPES = [
    { value: "SALE", label: "Продажа" },
    { value: "RENT", label: "Аренда" },
] as const;

export const PROPERTY_TYPES = [
    { value: "APARTMENT", label: "Квартира" },
    { value: "HOUSE", label: "Дом" },
    { value: "ROOM", label: "Комната" },
    { value: "LAND", label: "Земельный участок" },
    { value: "COMMERCIAL", label: "Коммерческая недвижимость" },
] as const;

export const LAYOUT_TYPES = [
    { value: "STUDIO", label: "Студия" },
    { value: "SEPARATE_ROOMS", label: "Раздельные комнаты" },
    { value: "OPEN_PLAN", label: "Свободная планировка" },
] as const;

export const WALL_MATERIALS = [
    { value: "BRICK", label: "Кирпич" },
    { value: "PANEL", label: "Панель" },
    { value: "MONOLITH", label: "Монолит" },
    { value: "WOOD", label: "Дерево" },
    { value: "BLOCK", label: "Блок" },
    { value: "FRAME", label: "Каркас" },
    { value: "OTHER", label: "Другое" },
] as const;

export const BATHROOM_LAYOUTS = [
    { value: "COMBINED", label: "Совмещенный" },
    { value: "SEPARATE", label: "Раздельный" },
] as const;

export const HEATING_TYPES = [
    { value: "CENTRAL", label: "Центральное" },
    { value: "AUTONOMOUS", label: "Автономное" },
    { value: "DECENTRALIZED", label: "Децентрализованное" },
] as const;

export const CITY_SIDES = [
    { value: "LEFT", label: "Левая сторона" },
    { value: "RIGHT", label: "Правая сторона" },
] as const;

export const RENOVATION_TYPES = [
    { value: "SHELL", label: "Без отделки" },
    { value: "BLACK", label: "Черновая отделка" },
    { value: "COSMETIC", label: "Косметический ремонт" },
    { value: "DESIGNER", label: "Дизайнерский ремонт" },
    { value: "EURO", label: "Евроремонт" },
] as const;

