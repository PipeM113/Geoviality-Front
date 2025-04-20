import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

interface User {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password?: string;
  tipo: number; //le agregue algo
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  sw: Coordinate;  // Esquina suroeste
  ne: Coordinate;  // Esquina noreste
}

type TiposDeHoyo = "hoyo" | "lomo-de-toro" | "grieta" | "hoyo-con-agua" |"longitudinal"|"transversal"|"cocodrilo";
type TiposDeOcurrencia = "acera" | "poste" | "ciclovia" | "cableado" |"basura"|"otro";

function useAPIServer(
  apiClient: AxiosInstance = axios,
  apiUrl: string = `https://${process.env.REACT_APP_NGROK_DOMAIN}`
) {

  const getProcessedInfo = async () => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/processed_info`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getProcessedInfo\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data;
    } catch (error) {
      console.error("useAPIServer/getProcessedInfo\nError al obtener JSON:", error);
      throw error;
    }
  };

  //* Esta funcion es mas general, porfavor usar esta en vez
  //* de las otras funciones como getInfoBaches, getInfoLomo, getInfoGrieta, getInfoHagua
  //TODO: Hacer que se use esta funcion en vez de las otras en las otras partes del codigo.
  const getProcessedInfoByType = async (type: TiposDeHoyo) => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/processed_info/${type}`,  // Endpoint para obtener información adicional
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getProcessedInfoByType - Tipo:${type}\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data; // Devuelve los datos adicionales
    } catch (error) {
      console.error(`useAPIServer/getProcessedInfoByType - Tipo:${type}}\nError al obtener JSON:`, error);
      throw error;
    }
  };


  const getProcessedInfoByTypeWalk = async (type: TiposDeOcurrencia) => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/processed_sidewalks/${type}`,  // Endpoint para obtener información adicional
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getProcessedInfoByTypeWalk - Tipo:${type}\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data; // Devuelve los datos adicionales
    } catch (error) {
      console.error(`useAPIServer/getProcessedInfoByTypeWalk - Tipo:${type}}\nError al obtener JSON:`, error);
      throw error;
    }
  };

  // Función para obtener los datos de calles
  const sendStreets = async (boundingBox: BoundingBox) => {
    const config: AxiosRequestConfig = {
        method: "post",
        url: `${apiUrl}/data/streets`, // Endpoint de las calles
        headers: {
            "ngrok-skip-browser-warning": "true",
        },
        data: {
            sw: {
                latitude: boundingBox.sw.latitude,
                longitude: boundingBox.sw.longitude
            },
            ne: {
                latitude: boundingBox.ne.latitude,
                longitude: boundingBox.ne.longitude
            }
        }
    };
    try {
        const response = await apiClient.request(config);
        console.log("Respuesta completa: ", response);
        console.log("Datos JSON:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener datos de calles:", error);
        throw error;
    }
};

  const getImageById = async (imageId: string): Promise<string> => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/download/get_image/${imageId}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      responseType: "blob",
    };

    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getImageById\nRespuesta: ${response.status} - Datos de la imagen:`, response.data);

      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    } catch (error) {
      console.error("useAPIServer/getImageById\nError al obtener la imagen:", error);
      return "";
    }
  };

  const getPointData = async (pointID: string) => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/point/${pointID}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getPointData\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data;
    } catch (error) {
      console.error("useAPIServer/getPointData\nError al obtener JSON:", error);
      throw error;
    }
  }

  const putModifyPoint = async (pointID: string, data: any) => {
    let config: AxiosRequestConfig = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/update_data/${pointID}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      data: data,
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/putModifyPoint\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.status;
    } catch (error) {
      console.error("useAPIServer/putModifyPoint\nError al obtener JSON:", error);
      throw error;
    }
  }

  const deletePoint = async (pointID: string) => {
    let config: AxiosRequestConfig = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/delete_data/${pointID}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/deletePoint\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.status;
    } catch (error) {
      console.error("useAPIServer/deletePoint\nError al obtener JSON:", error);
      throw error;
    }
  }

  const createNewUser = async (user: User) => {
    let config: AxiosRequestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiUrl}/user/create`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      data: {
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        password: user.password,
        tipo: user.tipo //aqui cambie algo
      },
    };

    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/createNewUser\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.status;
    } catch (error) {
      console.error("useAPIServer/createNewUser\nError al obtener JSON:", error);
      throw error;
    }
  }

  const deleteUser = async (username: string) => {
    let config: AxiosRequestConfig = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${apiUrl}/user/delete/${username}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };

    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/deleteUser\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.status;
    } catch (error) {
      console.error("useAPIServer/deleteUser\nError al obtener JSON:", error);
      throw error;
    }
  }

  const editUser = async (user: User) => {
    let config: AxiosRequestConfig = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${apiUrl}/user/update/${user.username}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      data: {
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        password: user.password,
        tipo: user.tipo //aqui cambie algo
      },
    };

    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/editUser\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.status;
    } catch (error) {
      console.error("useAPIServer/editUser\nError al obtener JSON:", error);
      throw error;
    }
  }

  const getAllUsers = async () => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/user/read_all`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };

    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getAllUsers\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data;
    } catch (error) {
      console.error("useAPIServer/getAllUsers\nError al obtener JSON:", error);
      throw error;
    }
  }

  const getUserByUsername = async (username: string) => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/user/read/${username}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };

    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getUserByUsername\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data;
    } catch (error) {
      console.error("useAPIServer/getUserByUsername\nError al obtener JSON:", error);
      throw error;
    }
  }

  const getHistoricalData = async () => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/historical_data`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log("Respuesta completa:", response);
      console.log("Datos JSON:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener JSON:", error);
      throw error;
    }
  }

  const getProcessedInfoByDate = async (anio: number, mes: number) => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/processed_info/date/${anio}/${mes}`,  // Endpoint para obtener información adicional
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getProcessedInfoByDate - Respuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data; // Devuelve los datos adicionales
    } catch (error) {
      console.error(`useAPIServer/getProcessedInfoByDate - Error al obtener JSON:`, error);
      throw error;
    }
  };

  const getStreetNameByCoord = async (lon:number, lat:number) => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/getStreetName/${lon}/${lat}`,  // Endpoint para obtener información adicional
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getStreetNameByCoord - Respuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data as string; // Devuelve los datos adicionales
    } catch (error) {
      return "Sin calle."
    }
  }

  const getPointDataSidewalk = async (pointID: string) => {
    let config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiUrl}/data/point/sidewalks/${pointID}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/getPointDataSidewalk\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.data;
    } catch (error) {
      console.error("useAPIServer/getPointDataSidewalk\nError al obtener JSON:", error);
      throw error;
    }
  }

  const putModifyPointSidewalk = async (pointID: string, data: any) => {
    let config: AxiosRequestConfig = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${apiUrl}/update/sidewalks/${pointID}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      data: data,
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/putModifyPointSidewalk\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.status;
    } catch (error) {
      console.error("useAPIServer/putModifyPointSidewalk\nError al obtener JSON:", error);
      throw error;
    }
  }

  const deletePointSidewalk = async (pointID: string) => {
    let config: AxiosRequestConfig = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${apiUrl}/delete/sidewalks/${pointID}`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log(`useAPIServer/deletePointSidewalk\nRespuesta: ${response.status} - Datos JSON:`, response.data);
      return response.status;
    } catch (error) {
      console.error("useAPIServer/deletePointSidewalk\nError al obtener JSON:", error);
      throw error;
    }
  }

  return {
    getProcessedInfo,
    getProcessedInfoByType,
    getProcessedInfoByTypeWalk,
    sendStreets,
    getImageById,
    getPointData,
    putModifyPoint,
    deletePoint,
    createNewUser,
    deleteUser,
    editUser,
    getAllUsers,
    getUserByUsername,
    getHistoricalData,
    getProcessedInfoByDate,
    getStreetNameByCoord,
    getPointDataSidewalk,
    putModifyPointSidewalk,
    deletePointSidewalk,
  };
}

export default useAPIServer;
