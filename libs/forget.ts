export const forget =  {
    now: new Date(),

    generateDateAndToken(){
        const _now = this.now;
        const token = crypto.randomUUID();

        _now.setHours(_now.getHours() + 1);
    
        return {
            now: _now,
            token
        }
    },

    validateToken({ passwordResetExpires, passwordResetToken, token }:{ 
        passwordResetToken: string | null; 
        passwordResetExpires: Date | null; 
        token: string;
    }){
        const _now = this.now;

        if(!passwordResetExpires) return { success: false, message: "Tempo não registrado" };
        if(passwordResetToken !== token) return { success: false, message: "Token inválido" };
        if(_now > passwordResetExpires) return { success: false, message: "Token sem validade" };

        return { success: true, message: null };
    }
}