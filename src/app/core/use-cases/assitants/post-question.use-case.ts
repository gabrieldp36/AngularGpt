import { QuestionResponse } from "@interfaces/question.response";
import { environment } from "environments/environment";

export const postQuestionUseCase = async (threadId: string, question: string) => {
    
    try {
        
        const resp = await fetch(`${environment.assistantApi}/user-question`, {
            method: 'POST',
            body: JSON.stringify({
               threadId,
               question
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if(!resp.ok) throw new Error();
        
        const replies = await resp.json() as QuestionResponse[];
        
        return {
            ok: true,
            replies
        };

    } catch (error) {
        
        console.error(error);
        return {
            ok: false,
            message: 'No sea ha podido generar la consulta.',
        };
    };
};