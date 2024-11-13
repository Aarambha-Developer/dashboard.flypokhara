class RequestRepo {
  async get(request: TRequest): Promise<void> {
    const { endPoint, token, params, data, success, failure } = request;
    //  convert params to query string
    let queryString = '';
    if (params) {
      queryString = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join('&');
    }
    const url = `${endPoint}?${queryString}`;

    try {
      const response = await fetch(url, {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(response.statusText || 'error');
      }
      const data = await response.json();

      if (response.ok) success(data?.message || 'success', data);
    } catch (error: any) {
      failure(error || 'error');
    }
  }
  async post(request: TRequest): Promise<void> {
    const { endPoint, token, params, data, success, failure } = request;
    try {
      const response: TpostResponse = await fetch(endPoint, {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: JSON.stringify(request.data || {}),
      });
      const data = await response.json();
      if (!response.ok) {
        failure(data || { message: 'error' });
      }
      if (response.ok) success(data?.message || 'success', data);
    } catch (error: any) {
      failure(error || 'error');
    }
  }
  async patch(request: TRequest) {
    const { endPoint, token, params, data, success, failure } = request;
    try {
      const response: TpatchResponse = await fetch(endPoint, {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'PATCH',
        body: JSON.stringify(request.data || {}),
      });
      const data = await response.json();
      if (!response.ok) {
        failure(data || 'error');
      }
      if (response.ok) success(data?.message || 'success', data);
    } catch (error: any) {
      failure(error || 'error');
    }
  }
  async delete(request: TRequest): Promise<void> {
    const { endPoint, token, success, failure } = request;
    try {
      const response: TdeleteResponse = await fetch(endPoint, {
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        failure(data || 'error');
      }
      if (response.ok) success(data?.message || 'success', data);
    } catch (error: any) {
      failure(error || 'error');
    }
  }

  async postWithFile(request: TRequest) {
    const { endPoint, token, params, data, success, failure } = request;
    try {
      const response: TpostWithFileResponse = await fetch(endPoint, {
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: request.data,
      });
      const data = await response.json();
      if (!response.ok) {
        failure(data || 'error');
      }
      if (response.ok) success(data?.message || 'success', data);
    } catch (error: any) {
      failure(error || 'error');
    }
  }
}
export default new RequestRepo();

// types here
type TRequest = {
  endPoint: string;
  token?: string;
  params?: any;
  data?: any;
  success: (message: string, data: any) => void;
  failure: (message: string) => void;
};

interface IRequestRepo {
  get(request: TRequest): Promise<void>;
  post(request: TRequest): Promise<TpostResponse>;
  patch(request: TRequest): Promise<TpatchResponse>;
  delete(request: TRequest): Promise<TdeleteResponse>;
  postWithFile(request: TRequest): Promise<TpostWithFileResponse>;
}

type TgetResponse = TgetSuccessResponse | TgetFailureResponse;
type TpostResponse = any;
type TpatchResponse = any;
type TdeleteResponse = any;
type TpostWithFileResponse = any;

type TgetSuccessResponse = {
  success: true;
  data: any;
};
type TgetFailureResponse = {
  success: false;
  error: string;
};
