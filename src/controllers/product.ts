import type { RequestHandler } from 'express';
import axios from 'axios';
import config from '../config/index.js';
import { ProductSchema, ProductListSchema } from '#schemas';

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const {
      page = 1,
      per_page = 12,
      search,
      category,
      tag,
      attribute,
      orderby = 'date',
      order = 'desc',
      min_price,
      max_price,
      on_sale,
      featured,
      stock_status,
      include,
      exclude
    } = req.query;

    const queryParams: any = {
      page: Number(page),
      per_page: Math.min(Number(per_page), 100),
      orderby,
      order
    };

    if (search) queryParams.search = search;
    if (category) queryParams.category = category;
    if (tag) queryParams.tag = tag;
    if (attribute) queryParams.attribute = attribute;
    if (min_price) queryParams.min_price = min_price;
    if (max_price) queryParams.max_price = max_price;
    if (on_sale === 'true') queryParams.on_sale = true;
    if (featured === 'true') queryParams.featured = true;
    if (stock_status) queryParams.stock_status = stock_status;
    if (include) queryParams.include = include;
    if (exclude) queryParams.exclude = exclude;

    const response = await axios.get(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products`, {
      params: queryParams,
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    const products = response.data.map((item: any) => ProductSchema.parse(item));

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          perPage: Number(per_page)
        }
      }
    });
  } catch (error: any) {
    console.error('Get products error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch products'
    });
  }
};

export const getProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products/${id}`, {
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    const product = ProductSchema.parse(response.data);

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('Get product error:', error.message);

    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch product'
    });
  }
};

export const getProductBySlug: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;

    const response = await axios.get(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products`, {
      params: { slug },
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    if (!response.data || response.data.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    const product = ProductSchema.parse(response.data[0]);

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('Get product by slug error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch product'
    });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData = req.body;

    const response = await axios.post(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products`, productData, {
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    const product = ProductSchema.parse(response.data);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error: any) {
    console.error('Create product error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to create product'
    });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const response = await axios.put(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products/${id}`, productData, {
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    const product = ProductSchema.parse(response.data);

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error: any) {
    console.error('Update product error:', error.message);

    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to update product'
    });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false, force = false } = req.query;

    const response = await axios.delete(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products/${id}`, {
      params: {
        force: force === 'true' || permanent === 'true'
      },
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: response.data
    });
  } catch (error: any) {
    console.error('Delete product error:', error.message);

    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to delete product'
    });
  }
};

export const getProductVariations: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products/${id}/variations`, {
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Get product variations error:', error.message);

    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch variations'
    });
  }
};

export const getFeaturedProducts: RequestHandler = async (req, res) => {
  try {
    const { per_page = 12 } = req.query;

    const response = await axios.get(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products`, {
      params: {
        featured: true,
        per_page: Math.min(Number(per_page), 100)
      },
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    const products = response.data.map((item: any) => ProductSchema.parse(item));

    res.json({
      success: true,
      data: products
    });
  } catch (error: any) {
    console.error('Get featured products error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch featured products'
    });
  }
};

export const getProductsOnSale: RequestHandler = async (req, res) => {
  try {
    const { per_page = 12 } = req.query;

    const response = await axios.get(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products`, {
      params: {
        on_sale: true,
        per_page: Math.min(Number(per_page), 100)
      },
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    const products = response.data.map((item: any) => ProductSchema.parse(item));

    res.json({
      success: true,
      data: products
    });
  } catch (error: any) {
    console.error('Get products on sale error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch products on sale'
    });
  }
};

export const getProductsByCategory: RequestHandler = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { per_page = 12, page = 1 } = req.query;

    const response = await axios.get(`${config.WOOCOMMERCE_URL}/wp-json/wc/v3/products`, {
      params: {
        category: categoryId,
        per_page: Math.min(Number(per_page), 100),
        page: Number(page)
      },
      auth: {
        username: config.WOOCOMMERCE_CONSUMER_KEY,
        password: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    const products = response.data.map((item: any) => ProductSchema.parse(item));

    res.json({
      success: true,
      data: products,
      pagination: {
        total: parseInt(response.headers['x-wp-total'] || '0', 10),
        totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10),
        currentPage: Number(page),
        perPage: Number(per_page)
      }
    });
  } catch (error: any) {
    console.error('Get products by category error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch products by category'
    });
  }
};
