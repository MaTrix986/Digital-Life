'use client'

import { inputMsg } from "../lib/actions";

export default function InputBox({ placeholder }: { placeholder: string }) {
    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <form action={inputMsg}>
                <input 
                    name="msg"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder={placeholder}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}