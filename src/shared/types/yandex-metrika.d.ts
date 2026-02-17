declare global {
    interface Window {
        ym?: (counterId: number, method: string, ...params: unknown[]) => void;
    }
}

export {};
