class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    if (queryObj.category) {
      queryObj.category = queryObj.category.split(' ').map((el) => {
        let type;
        switch (el) {
          case 'action':
            type = 'Hành Động';
            break;
          case 'adventure':
            type = 'Phiêu Lưu';
            break;
          case 'horror':
            type = 'Kinh Dị';
            break;
          case 'comedy':
            type = 'Hài Hước';
            break;
          case 'family':
            type = 'Gia Đình';
            break;
          case 'fiction':
            type = 'Viễn Tưởng';
            break;
          case 'love':
            type = 'Tình Cảm';
            break;
          case 'school':
            type = 'Học Đường';
            break;
          default:
            break;
        }
        return { name: type };
      });
    }

    if (queryObj.country) {
      queryObj.country = queryObj.country.split(' ').map((el) => {
        let type;
        switch (el) {
          case 'china':
            type = 'Trung Quốc';
            break;
          case 'japan':
            type = 'Nhật Bản';
            break;
          case 'us-uk':
            type = 'Âu Mỹ';
            break;
          default:
            break;
        }
        return { name: type };
      });
    }

    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // ALL
    const expArr = [];

    // Add category expression if there is a category field
    queryObj.category?.forEach((el) => {
      expArr.push({
        'movie.category': {
          $elemMatch: el,
        },
      });
    });

    // Add country expression if there is a country field
    queryObj.country?.forEach((el) => {
      expArr.push({
        'movie.country': {
          $elemMatch: el,
        },
      });
    });

    this.query =
      expArr.length > 0
        ? this.query.find({
            $and: expArr,
          })
        : this.query.find();

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 24;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
