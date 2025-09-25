const AboutPage = require('../models/AboutPage');

const getAboutPage = async (req, res) => {
  try {
    let aboutPage = await AboutPage.findOne();
    if (!aboutPage) {
      aboutPage = { content: '' };
    }
    res.status(200).json({
      message: 'About page retrieved successfully',
      data: aboutPage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateAboutPage = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    let aboutPage = await AboutPage.findOne();
    if (!aboutPage) {
      aboutPage = new AboutPage({ content });
      await aboutPage.save();
      return res.status(201).json({
        message: 'About page created successfully',
        data: aboutPage
      });
    }

    aboutPage.content = content;
    await aboutPage.save();

    res.status(200).json({
      message: 'About page updated successfully',
      data: aboutPage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getAboutPage, updateAboutPage };