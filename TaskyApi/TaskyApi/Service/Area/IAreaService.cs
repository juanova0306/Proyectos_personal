using TaskyApi.DTOs.Area;

namespace TaskyApi.Service.Area
{
    public interface IAreaService
    {
        Task<List<AreaResponse>> Listar();
    }
}
