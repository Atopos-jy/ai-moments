import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载自定义路径的环境变量（从 src/env/.env 读取）
  const env = loadEnv(mode, path.resolve(__dirname, "./src/env"), "");
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // 将环境变量注入到项目中
    define: {
      "import.meta.env.VITE_DASHSCOPE_API_KEY": JSON.stringify(
        env.VITE_DASHSCOPE_API_KEY || ""
      ),
    },
    // 配置代理解决跨域问题
    server: {
      proxy: {
        "/api/dashscope": {
          target: "https://dashscope.aliyuncs.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/dashscope/, ""),
        },
      },
    },
    optimizeDeps: {
      include: ["antd", "@ant-design/icons", "axios"],
    },
  };
});
