using System;
using RabbitMQ.Client;
using Polly;

namespace Analyzer
{
    abstract class QueueBase
    {
        protected QueueBase(string hostName, string queueName)
        {
            ConnectionFactory factory = new ConnectionFactory
            {
                HostName = hostName
            };

            var policy = Policy
                .Handle<RabbitMQ.Client.Exceptions.BrokerUnreachableException>()
                .WaitAndRetryForever(i => TimeSpan.FromSeconds(5), (ex, time) => Console.WriteLine($"Unable to connect to broker with hostname '{hostName}'. Retrying."));
            IConnection conn = policy.Execute(() => factory.CreateConnection());
            Channel = conn.CreateModel();
            Channel.QueueDeclare(queueName, false, false, false, null);
        }

        protected IModel Channel { get; }
    }
}
