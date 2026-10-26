import type { RefObject, Dispatch, SetStateAction } from 'react';
import styles from './HiddenInput.module.css'

interface HiddenInputProps {
    inputRef: RefObject<HTMLInputElement | null>;
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
}

export function HiddenInput({inputRef, input, setInput}: HiddenInputProps) {
    return (
        <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.input}
        />
    )
}