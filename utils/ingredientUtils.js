import API, { endpoints } from "@/app/configs/API";

export async function getIngredientNameById(id) {
    try {
        const response = await API.get(`${endpoints.getIngredientById}/${id}`);
        console.log("LẤY DATA THÀNH CÔNG")
        return response.data.name; // Giả sử phản hồi chứa trường `name`
    } catch (error) {
        console.error(`Failed to fetch ingredient with ID ${id}:`, error);
        return "Unknown";
    }
}
