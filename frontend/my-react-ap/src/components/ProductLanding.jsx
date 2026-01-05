import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductLanding() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Contact form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    axios.get('/api/products/1')
      .then(response => {
        setProduct(response.data);
        setLoading(false);
        console.log('Fetched product data:', response.data);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message || 'שגיאה בטעינת המוצר');
        setLoading(false);
        console.error('Error fetching product data:', err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    // Validation
    if (!formData.name || !formData.phone || !formData.email) {
      setFormError('נא למלא את כל השדות החובה');
      setFormSubmitting(false);
      return;
    }

    try {
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        source: 'one-pager',
        productInterest: product?.id || '1',
        status: 'new'
      };

      await axios.post('/api/leads', leadData);
      setFormSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      setFormError(err.response?.data?.error || 'שגיאה בשליחת הטופס. נסה שוב.');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">טוען מוצר...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">שגיאה</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg text-gray-600">לא נמצא מוצר</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <img src="/images/e1691482345661.webp" alt="Dimer Logo" className="h-16" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">מוצרי Dimer Premium</h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8" style={{direction: 'rtl'}}>
            {/* Product Image */}
            <div className="relative h-96 lg:h-auto bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden lg:order-last">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-white text-center p-8">
                  <svg className="w-32 h-32 mx-auto mb-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl font-semibold">תמונת מוצר</p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-12 lg:order-first">
              <div className="mb-6">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                  {product.model || 'דימר חכם'}
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name || 'מוצר Dimer'}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {product.features || 'מוצר איכותי ומתקדם המיועד לספק את הפתרון המושלם לצרכים שלך'}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">מפרטים טכניים</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">דגם:</span>
                    <span className="text-gray-600">{product.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">מחוונים:</span>
                    <span className="text-gray-600">{product.positions} מחוון</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">צבע:</span>
                    <span className="text-gray-600">{product.color}</span>
                  </div>
                  {product.inStock && (
                    <div className="flex justify-between pb-2">
                      <span className="font-semibold text-gray-700">זמינות:</span>
                      <span className="text-green-600 font-semibold">במלאי</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between">
                {product.price && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">מחיר</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      ₪{product.price.toLocaleString()}
                    </p>
                  </div>
                )}
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300">
                  הוסף לסל
                </button>
              </div>

              {/* Stock Status */}
              {product.inStock !== undefined && (
                <div className="mt-6">
                  {product.inStock ? (
                    <div className="flex items-center text-green-600 mb-6">
                      <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">במלאי - משלוח מיידי</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 mb-6">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">אזל מהמלאי</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-8" style={{direction: 'rtl'}}>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition hover:scale-105">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">משלוח חינם</h3>
            <p className="text-gray-600">על כל הזמנה מעל ₪200</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition hover:scale-105">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">אחריות מלאה</h3>
            <p className="text-gray-600">שנתיים אחריות יצרן</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition hover:scale-105">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">תשלום מאובטח</h3>
            <p className="text-gray-600">כל אמצעי התשלום</p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">מעוניינים במוצר? צרו קשר</h2>
            <p className="text-indigo-100 text-center mt-2">מלאו את הפרטים ונחזור אליכם בהקדם</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            {formSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-semibold">הפנייה נשלחה בהצלחה! נחזור אליך בקרוב.</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800">{formError}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  שם מלא <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="הזן את שמך המלא"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  טלפון <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="050-1234567"
                />
              </div>

              {/* Email Field */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  אימייל <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="example@email.com"
                />
              </div>

              {/* Message Field */}
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  הודעה
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                  placeholder="ספר לנו עוד על הצרכים שלך..."
                />
              </div>
            </div>

            {/* Product Interest (hidden, auto-filled) */}
            <input type="hidden" name="productInterest" value={product?.id || '1'} />

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={formSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-lg shadow-xl transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {formSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    שולח...
                  </span>
                ) : (
                  'שלח פנייה'
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">* שדות חובה</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductLanding;
