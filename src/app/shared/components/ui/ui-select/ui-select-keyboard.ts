interface SelectKeyboardOptions {
    event: KeyboardEvent;
    isOpen: boolean;
    activeIndex: number;
    optionCount: number;
    open: () => void;
    close: () => void;
    setActiveIndex: (index: number) => void;
    selectActiveOption: () => void;
}

export function handleSelectKeydown({
    event,
    isOpen,
    activeIndex,
    optionCount,
    open,
    close,
    setActiveIndex,
    selectActiveOption,
}: SelectKeyboardOptions): void {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (!isOpen) {
                open();
            } else {
                setActiveIndex(Math.min(activeIndex + 1, optionCount - 1));
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (!isOpen) {
                open();
            } else {
                setActiveIndex(Math.max(activeIndex - 1, 0));
            }
            break;
        case 'Enter':
        case ' ':
            event.preventDefault();
            if (!isOpen) {
                open();
            } else if (activeIndex >= 0) {
                selectActiveOption();
            }
            break;
        case 'Escape':
        case 'Tab':
            if (isOpen) {
                if (event.key === 'Escape') event.preventDefault();
                close();
            }
            break;
    }
}
