export const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    if (imagePath.startsWith('data:')) {
        return imagePath;
    }
    return `https://fundament.uz/img/${imagePath}`;
};
