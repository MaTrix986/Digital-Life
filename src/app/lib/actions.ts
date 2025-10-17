import { socket } from '@/socket';
import { z } from 'zod'

const InputMsg = z.object({
    msg: z.string()
})


export async function inputMsg(formData: FormData) {
    const msg = InputMsg.parse({
        msg: formData.get('msg'),
    });

    socket.emit('chat message', msg);
}