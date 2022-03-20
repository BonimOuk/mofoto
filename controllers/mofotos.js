const Mofoto = require('../models/mofoto');

module.exports.index = async (req, res) => {
  const mofotos = await Mofoto.find({});
  res.render('mofotos/index', { mofotos });
};

module.exports.renderNewForm = (req, res) => {
  res.render('mofotos/new');
};

module.exports.createMofoto = async (req, res, next) => {
  const mofoto = new Mofoto(req.body.mofoto);
  mofoto.author = req.user._id;
  await mofoto.save();
  req.flash('success', 'Successfully made a new mofoto!');
  res.redirect(`/mofotos/${mofoto._id}`);
};

module.exports.showMofoto = async (req, res) => {
  const mofoto = await Mofoto.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  console.log(mofoto);
  if (!mofoto) {
    req.flash('error', 'Cannot find that mofoto!');
    return res.redirect('/mofotos');
  }
  res.render('mofotos/show', { mofoto });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const mofoto = await Mofoto.findById(id);
  if (!mofoto) {
    req.flash('error', 'Cannot find that mofoto!');
    return res.redirect('/mofotos');
  }
  res.render('mofotos/edit', { mofoto });
};

module.exports.updateMofoto = async (req, res) => {
  const { id } = req.params;

  const mofoto = await Mofoto.findByIdAndUpdate(id, { ...req.body.mofoto });
  req.flash('success', 'Successfully updated mofoto!');
  res.redirect(`/mofotos/${mofoto._id}`);
};

module.exports.deleteMofoto = async (req, res) => {
  const { id } = req.params;
  await Mofoto.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted mofoto!');
  res.redirect('/mofotos');
};