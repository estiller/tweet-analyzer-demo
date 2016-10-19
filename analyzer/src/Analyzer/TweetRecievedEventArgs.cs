using Analyzer.Model;
using System;

namespace Analyzer
{
    class TweetRecievedEventArgs : EventArgs
    {
        public Tweet Tweet { get; set; }

        public ulong TweetDeliveryTag { get; set; }
    }
}