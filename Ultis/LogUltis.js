module.exports = new LogUltils();

LogUltils.prototype.log = function (data) {
    this.xx();
    console.log(data);
}

LogUltils.prototype.xx = function () {
    console.log('xxx');
}

function LogUltils() {
    return this;
}
