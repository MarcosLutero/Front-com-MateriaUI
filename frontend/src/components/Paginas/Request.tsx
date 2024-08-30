import superagent from "superagent";

const Request = (method: string, url: string, token: string) => {

    const request = superagent(method, url)
        .set({ Accept: 'json', Authorization: `Bearer ${token}` })

    return request;
}

export default Request;