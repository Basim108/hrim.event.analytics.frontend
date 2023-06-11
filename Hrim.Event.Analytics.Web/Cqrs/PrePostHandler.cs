using MediatR;

namespace Hrim.Event.Analytics.Web.Cqrs
{
    public class PrePostHandler<TRequest, TResponse>: IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly ILogger<PrePostHandler<TRequest, TResponse>> _logger;

        public PrePostHandler(ILogger<PrePostHandler<TRequest, TResponse>> logger) { _logger = logger; }

        public async Task<TResponse> Handle(TRequest                          request,
                                            RequestHandlerDelegate<TResponse> next,
                                            CancellationToken                 cancellationToken) {
            using var commandScope = _logger.BeginScope(WebConsts.COMMAND, typeof(TRequest).Name);
            _logger.LogDebug(WebConsts.START_HANDLING);

            var response = await next().ConfigureAwait(false);

            _logger.LogDebug(WebConsts.FINISH_HANDLING);
            return response;
        }
    }
}