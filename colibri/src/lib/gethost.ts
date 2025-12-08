

export const getHostOnClientSide  = () => {
    if(process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_HOST ;
    }
    return new URL(window.location.origin).hostname;
}

export const getHostServerSide  = (host: string | null) => {
    if(process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_HOST ;
    }
    return host;
}