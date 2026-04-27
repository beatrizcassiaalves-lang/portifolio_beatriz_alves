import { Shield, Zap, Cpu } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Advanced Username Intelligence",
    description: "WhatsMyName App Web scans 500+ platforms including social networks, forums, gaming sites, and professional networks using cutting-edge discovery algorithms.",
    icon: <Cpu className="text-brand-purple" size={32} />,
  },
  {
    title: "Real-Time Discovery Engine",
    description: "WhatsMyName App's parallel processing technology delivers comprehensive username results in seconds across all monitored platforms.",
    icon: <Zap className="text-brand-purple" size={32} />,
  },
  {
    title: "Enterprise-Grade Privacy",
    description: "WhatsMyName Web ensures complete privacy with encrypted searches, zero data retention, and advanced security protocols.",
    icon: <Shield className="text-brand-purple" size={32} />,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-dark mb-4"
          >
            Why WhatsMyName Web Leads Username Discovery
          </motion.h2>
          <div className="w-20 h-1.5 bg-brand-purple mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-brand-purple/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
